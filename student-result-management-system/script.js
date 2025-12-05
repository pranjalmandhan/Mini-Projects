const form = document.getElementById('resultForm');
const calcBtn = document.getElementById('calcBtn');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const printBtn = document.getElementById('printBtn');
const editBtn = document.getElementById('editBtn');
const historyTableBody = document.querySelector('#historyTable tbody');
const noHistory = document.getElementById('noHistory');
const clearAllBtn = document.getElementById('clearAllBtn');

const fields = ['name','roll','sub1','sub2','sub3','sub4','sub5'];

function getValues(){
  const obj = {};
  for(const id of fields){
    obj[id] = document.getElementById(id).value.trim();
  }
  return obj;
}

function validateInputs(values){
  if(!values.name || !values.roll) return "Name and Roll are required.";
  for(let i=1;i<=5;i++){
    const v = values['sub'+i];
    if(v === '') return `Please enter marks for Subject ${i}.`;
    const n = Number(v);
    if(Number.isNaN(n) || n < 0 || n > 100) return `Subject ${i} marks must be 0-100.`;
  }
  return null;
}

function calculate(values){
  const marks = [];
  for(let i=1;i<=5;i++) marks.push(Number(values['sub'+i]));
  const total = marks.reduce((a,b)=>a+b,0);
  const percentage = (total / (5*100)) * 100;
  // grade rules (you can adjust)
  let grade = 'F';
  if(percentage >= 80) grade = 'A+';
  else if(percentage >= 70) grade = 'A';
  else if(percentage >= 60) grade = 'B';
  else if(percentage >= 50) grade = 'C';
  else if(percentage >= 33) grade = 'D';
  else grade = 'F';

  // pass if all subjects >=33
  const pass = marks.every(m => m >= 33) && percentage >= 33;

  return {marks,total,percentage:Number(percentage.toFixed(2)),grade,pass};
}

function showResult(values, calc){
  resultContent.innerHTML = `
    <div class="result-item">
      <h4>Student</h4>
      <div><strong>${escapeHtml(values.name)}</strong></div>
      <div class="muted small">Roll: ${escapeHtml(values.roll)}</div>
    </div>
    <div class="result-item">
      <h4>Summary</h4>
      <div class="big">${calc.percentage}%</div>
      <div class="muted">Total: ${calc.total} / 500</div>
      <div style="margin-top:6px">
        <span class="badge ${calc.pass ? 'pass' : 'fail'}">${calc.pass ? 'PASS' : 'FAIL'}</span>
        <span style="margin-left:8px;font-weight:700">${calc.grade}</span>
      </div>
    </div>
    <div class="result-item" style="grid-column: span 2;">
      <h4>Marks Breakdown</h4>
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          ${calc.marks.map((m,i)=>`<tr><td>Subject ${i+1}</td><td style="text-align:right">${m} / 100</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  resultCard.style.display = 'block';
  resultCard.setAttribute('aria-hidden','false');
}

function escapeHtml(s){
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

// calc button
calcBtn.addEventListener('click', ()=>{
  const values = getValues();
  const error = validateInputs(values);
  if(error){ alert(error); return; }
  const calc = calculate(values);
  showResult(values, calc);
});

// save to localStorage
saveBtn.addEventListener('click', ()=>{
  const values = getValues();
  const error = validateInputs(values);
  if(error){ alert(error); return; }
  const calc = calculate(values);
  const record = {
    id: Date.now().toString(),
    name: values.name,
    roll: values.roll,
    marks: calc.marks,
    total: calc.total,
    percentage: calc.percentage,
    grade: calc.grade,
    pass: calc.pass
  };
  const all = JSON.parse(localStorage.getItem('results') || '[]');
  all.unshift(record);
  localStorage.setItem('results', JSON.stringify(all));
  renderHistory();
  showResult(values, calc);
  alert('Result saved locally.');
});

// edit (fill form with current displayed values)
editBtn.addEventListener('click', ()=>{
  // attempt to put displayed data back into form
  const name = document.getElementById('name');
  const roll = document.getElementById('roll');
  const items = resultContent.querySelectorAll('table tbody tr td:nth-child(2)');
  if(!items || items.length===0){ alert('No result to edit'); return; }
  name.value = name.value || '';
  roll.value = roll.value || '';
  // read marks from displayed content
  const marks = [];
  resultContent.querySelectorAll('table tbody tr').forEach((tr,i)=>{
    const val = tr.children[1].textContent.trim().split(' ')[0];
    document.getElementById('sub'+(i+1)).value = val;
  });
  // scroll to form
  window.scrollTo({top:0,behavior:'smooth'});
});

// print
printBtn.addEventListener('click', ()=>{
  // create printable window
  const printWindow = window.open('','_blank','width=800,height=600');
  const html = `
    <html>
      <head>
        <title>Print Result</title>
        <style>
          body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:20px}
          .card{border:1px solid #ddd;padding:12px;border-radius:8px}
          h2{margin-top:0}
          table{width:100%;border-collapse:collapse}
          td{padding:6px;border-bottom:1px solid #eee}
        </style>
      </head>
      <body>
        <div class="card">
          ${resultContent.innerHTML}
        </div>
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(()=>printWindow.print(),250);
});

// history rendering
function renderHistory(){
  const all = JSON.parse(localStorage.getItem('results') || '[]');
  historyTableBody.innerHTML = '';
  if(all.length === 0){
    noHistory.style.display = 'block';
    return;
  }
  noHistory.style.display = 'none';
  all.forEach(rec=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(rec.name)}</td>
      <td>${escapeHtml(rec.roll)}</td>
      <td>${rec.percentage}%</td>
      <td>${rec.grade}</td>
      <td><span class="badge ${rec.pass ? 'pass' : 'fail'}">${rec.pass ? 'PASS' : 'FAIL'}</span></td>
      <td>
        <button data-id="${rec.id}" class="btn small viewBtn">View</button>
        <button data-id="${rec.id}" class="btn small deleteBtn neutral">Delete</button>
      </td>
    `;
    historyTableBody.appendChild(tr);
  });

  // attach listeners
  document.querySelectorAll('.viewBtn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-id');
      const rec = JSON.parse(localStorage.getItem('results')||'[]').find(r=>r.id===id);
      if(!rec) return;
      // show in result card
      const values = {name:rec.name,roll:rec.roll};
      for(let i=1;i<=5;i++) values['sub'+i] = rec.marks[i-1];
      showResult(values, {marks:rec.marks, total:rec.total, percentage:rec.percentage, grade:rec.grade, pass:rec.pass});
      window.scrollTo({top:document.getElementById('resultCard').offsetTop-20, behavior:'smooth'});
    });
  });

  document.querySelectorAll('.deleteBtn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-id');
      if(!confirm('Delete this result?')) return;
      let arr = JSON.parse(localStorage.getItem('results')||'[]');
      arr = arr.filter(r=>r.id !== id);
      localStorage.setItem('results', JSON.stringify(arr));
      renderHistory();
    });
  });
}

// clear all
clearAllBtn.addEventListener('click', ()=>{
  if(!confirm('Clear all saved results?')) return;
  localStorage.removeItem('results');
  renderHistory();
});

// initialize
renderHistory();
