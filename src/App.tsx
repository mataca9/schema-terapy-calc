import React, { useEffect, useState } from 'react'
import './App.scss'

interface ISchemaResult {
  [key: string]: number;
}

const schemas = {
  "Privação Emocional": [1, 19, 37, 55, 73],
  "Abandono": [2, 20, 38, 56, 74],
  "Desconfiança / Abuso": [3, 21, 39, 57, 75],
  "Isolamento Social / Alienação": [4, 22, 40, 58, 76],
  "Defectividade / Vergonha": [5, 23, 41, 59, 77],
  "Fracasso": [6, 24, 42, 60, 78],
  "Dependência / Incompetência": [7, 25, 43, 61, 79],
  "Vulnerabilidade ao dano e doença": [8, 26, 44, 62, 80],
  "Emaranhamento": [9, 27, 45, 63, 81],
  "Subjugação": [10, 28, 46, 64, 82],
  "Autossacrifício": [11, 29, 47, 65, 83],
  "Inibição Emocional": [12, 30, 48, 66, 84],
  "Padrões Inflexíveis": [13, 31, 49, 67, 85],
  "Arrogo / Grandiosidade": [14, 32, 50, 68, 86],
  "Autocontrole / Autodisciplina Insuficientes": [15, 33, 51, 69, 87],
  "Busca de Aprovação / Reconhecimento": [16, 34, 52, 70, 88],
  "Negatividade / Pessimismo": [17, 35, 53, 71, 89],
  "Postura Punitiva": [18, 36, 54, 72, 90],
}

function App() {
  const [formResult, setFormResult] = useState([]);
  const [header, setHeader] = useState([]);
  const [schemaResult, setSchemaResult] = useState<ISchemaResult>({});
  const questionOffset = 2;

  const debug = true;

  function loadFormResult(files: any) {
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (e: any) => {
      const result = e.target.result.split('\n');
      setHeader(result.shift().split('\t'));
      setFormResult(result.map((r: string) => r.split('\t')));
    }
  }

  function handleSelected(selected: any) {
    if (!selected) return;

    const person = formResult[selected];

    const personSchema = {} as any;
    Object.entries(schemas).forEach(([key, schamaQuestions]) => {
      let total = 0;
      schamaQuestions.forEach(question => {
        total += Number(person[question + questionOffset]);
      })

      personSchema[key] = total / schamaQuestions.length;
    });

    setSchemaResult(personSchema);
  }

  function getSchemaClass(value: number) {
    if (value >= 4) return 'red'
    if (value >= 3) return 'orange'
    return 'green';
  }

  return (
    <div className="App">
      <div className="file" >
        <label htmlFor="file">Selecione o arquivo</label>
        <input id="file" type="file" accept=".tsv" onChange={e => loadFormResult(e.target.files)} />
      </div>

      <div className="data">
        <div className="header">
          {header.map(h => (<div key={h}>{h}</div>))}
        </div>

        <div className="result">
          {!!formResult.length && debug &&
            formResult.map((line: any, i) => (<div className="line" key={i}>
              {line.map((r: string, i: number) => (<div className="value" key={i}>
                {r.trim().length === 1 ? <div className="number">{r}</div> : r}
              </div>))}
            </div>))

          }
        </div>
      </div>

      <div className="avaliation">
        {!!formResult.length && <select onChange={(e: any) => handleSelected(e.target.value)}>
          <option value="">Selecione o paciente</option>
          {formResult.map((line, i) => (<option key={i} value={i}>{line[1]}</option>))}
        </select>}

        <hr />

        {schemaResult &&
          <div className="selected">
            {Object.entries(schemaResult).map(([key, value]) => {
              return <div className={'selected-line ' + getSchemaClass(value)} key={key}>
                <div>{key}</div>
                <div>{value}</div>
              </div>
            })}
          </div>
        }
      </div>
    </div>
  )
}

export default App
