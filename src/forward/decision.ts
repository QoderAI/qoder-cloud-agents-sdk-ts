import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';

export interface DecisionChoiceParam {
  /** Nonempty string or boolean, distinct within the question. */
  value: string | boolean;
  description?: string;
}

export interface DecisionLevelParam {
  label: string;
  /** A finite numeric score, including zero. */
  score: number;
  description?: string;
}

export type DecisionQuestionParam = {
  /** Optional unique, nonempty name, up to 128 bytes. */
  name?: string;
  instructions: string;
} & (
  | { type: 'choice'; choices: DecisionChoiceParam[]; levels?: never }
  | { type: 'score'; levels: DecisionLevelParam[]; choices?: never }
);

/** Provide exactly one input mode. No model parameter is accepted. */
export type DecisionCreateParams = {
  /** One to 32 questions, each with 2-32 choices or levels. */
  questions: DecisionQuestionParam[];
  /** Reusing a key with identical request bytes replays the stored result. */
  idempotency_key?: string;
} & (
  | { session_id: string; state?: never }
  | { session_id?: never; state: Record<string, unknown> }
);

export interface DecisionListParams {
  session_id?: string;
  /** Page size from 1 to 100; defaults to 20. */
  limit?: number;
  /** Mutually exclusive with before_id. */
  after_id?: string;
  before_id?: string;
}

export interface DecisionChoice extends DecisionChoiceParam { [key: string]: unknown; }
export interface DecisionLevel extends DecisionLevelParam { [key: string]: unknown; }
export interface DecisionQuestion {
  type: 'choice' | 'score';
  name?: string;
  instructions: string;
  choices?: DecisionChoice[];
  levels?: DecisionLevel[];
  [key: string]: unknown;
}

export interface DecisionAnswer {
  type: 'choice' | 'score';
  name?: string;
  value?: string | boolean;
  score?: number;
  [key: string]: unknown;
}

/** Input mode and Session event references. Session fields may be absent on running/failed records. */
export interface DecisionContext {
  mode: 'state' | 'session';
  anchor_event_id?: string;
  first_event_id?: string;
  last_event_id?: string;
  included_segment_count?: number;
  included_event_count?: number;
  [key: string]: unknown;
}

export interface DecisionError { code: string; message: string; [key: string]: unknown; }

export interface Decision {
  id: string;
  /** Null for explicit-state input. */
  session_id: string | null;
  source: string;
  status: 'running' | 'completed' | 'failed';
  questions: DecisionQuestion[];
  answers: DecisionAnswer[];
  context: DecisionContext;
  error: DecisionError | null;
  created_at: string;
  completed_at: string | null;
  [key: string]: unknown;
}

/** Evaluates explicit state or an accessible Session; uses normal PAT/SAT authentication.
 * The Decision API is in Beta. Its behavior may change in future updates.
 */
export class Decisions extends APIResource {
  /** Synchronously evaluate and store a Decision. State must be nonempty;
   * state.session_context is reserved for server-built history.
   * @operation createDecision
   */
  create(params: DecisionCreateParams, options?: RequestOptions): APIPromise<Decision> {
    const path = 'decisions';
    const { idempotency_key, ...body } = params;
    return this._client.request<Decision>({
      method: 'POST', path, body, ...options,
      headers: requestHeaders({ 'Idempotency-Key': idempotency_key }, options?.headers),
    });
  }

  /** Retrieve a Decision accessible to the current caller.
   * @operation getDecision
   */
  retrieve(decisionID: string, options?: RequestOptions): APIPromise<Decision> {
    const path = `decisions/${pathParam(decisionID, 'decisionID')}`;
    return this._client.request<Decision>({ method: 'GET', path, ...options });
  }

  /** List stored Decisions in server order, optionally filtered by an accessible Session.
   * @operation listDecisions
   */
  list(params: DecisionListParams = {}, options?: RequestOptions): PagePromise<Decision> {
    const path = 'decisions';
    return this._client.getAPIList<Decision>(path, params, options, 'cursor');
  }
}
