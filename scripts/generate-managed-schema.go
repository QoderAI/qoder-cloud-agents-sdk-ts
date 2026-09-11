// Extract the canonical public API and wire types without importing or executing the Go SDK.
// Invoked by generate-managed.py; all dependencies are Go's standard library.
package main

import (
	"bytes"
	"encoding/json"
	"go/ast"
	"go/parser"
	"go/printer"
	"go/token"
	"os"
	"path/filepath"
	"reflect"
	"strings"
)

type Field struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Tags map[string]string `json:"tags"`
	Doc string `json:"doc"`
}
type Type struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Fields []Field `json:"fields,omitempty"`
	Doc string `json:"doc"`
	File string `json:"file"`
}
type Method struct {
	Service string `json:"service"`
	Name string `json:"name"`
	Params []Field `json:"params"`
	Result string `json:"result"`
	Doc string `json:"doc"`
	Body string `json:"body"`
	File string `json:"file"`
}
func main() {
	fset := token.NewFileSet()
	printNode := func(n ast.Node) string { var b bytes.Buffer; printer.Fprint(&b, fset, n); return b.String() }
	fields := func(fl *ast.FieldList) (out []Field) {
		for _, f := range fl.List {
			tags := map[string]string{}
			if f.Tag != nil {
				tag := reflect.StructTag(strings.Trim(f.Tag.Value, "`"))
				for _, k := range []string{"json", "query", "path", "header", "api", "format"} { if v, ok := tag.Lookup(k); ok { tags[k] = v } }
			}
			for _, n := range f.Names { out = append(out, Field{n.Name, printNode(f.Type), tags, f.Doc.Text()}) }
		}
		return
	}
	types := []Type{}
	methods := []Method{}
	enums := map[string][]string{}
	variants := map[string][]string{}
	paths, err := filepath.Glob(filepath.Join(os.Args[1], "*.go")); if err != nil { panic(err) }
	for _, path := range paths {
		if strings.HasSuffix(path, "_test.go") { continue }
		file, err := parser.ParseFile(fset, path, nil, parser.ParseComments); if err != nil { panic(err) }
		for _, d := range file.Decls {
			switch d := d.(type) {
			case *ast.GenDecl:
				for _, spec := range d.Specs {
					switch s := spec.(type) {
					case *ast.TypeSpec:
						t := Type{Name:s.Name.Name, Type:printNode(s.Type), Doc:d.Doc.Text()+s.Doc.Text(), File:filepath.Base(path)}
						if st, ok := s.Type.(*ast.StructType); ok { t.Type = "struct"; t.Fields = fields(st.Fields) }
						types = append(types,t)
					case *ast.ValueSpec:
						if d.Tok == token.CONST && s.Type != nil { for _, v := range s.Values { enums[printNode(s.Type)] = append(enums[printNode(s.Type)],printNode(v)) } }
					}
				}
			case *ast.FuncDecl:
				if d.Recv == nil || d.Body == nil { continue }
				receiver := strings.TrimPrefix(printNode(d.Recv.List[0].Type),"*")
				body := printNode(d.Body)
				if strings.HasPrefix(d.Name.Name,"As") && strings.Contains(body,"apijson.UnmarshalRoot") && d.Type.Results != nil && len(d.Type.Results.List)==1 {
					variants[receiver] = append(variants[receiver],strings.TrimPrefix(printNode(d.Type.Results.List[0].Type),"*"))
				}
				if strings.HasSuffix(receiver,"Service") && !strings.Contains(d.Name.Name,"AutoPaging") {
					result := "void"; if d.Type.Results != nil { result=printNode(d.Type.Results.List[0].Type) }
					methods = append(methods,Method{receiver,d.Name.Name,fields(d.Type.Params),result,d.Doc.Text(),body,filepath.Base(path)})
				}
			}
		}
	}
	if err := json.NewEncoder(os.Stdout).Encode(map[string]any{"types":types,"methods":methods,"enums":enums,"variants":variants}); err != nil { panic(err) }
}
