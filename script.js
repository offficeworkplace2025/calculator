(function(){
  const display = document.getElementById('display');
  let current = '';

  function updateDisplay(){
    display.textContent = current || '0';
  }

  function append(val){
    const lastToken = current.split(/(\+|\-|\*|\/|%)/).pop();
    // ...existing code...
    if(val === '.' && lastToken.includes('.')) return;
    current += val;
    updateDisplay();
  }

  function clearAll(){ current = ''; updateDisplay(); }
  function backspace(){ current = current.slice(0,-1); updateDisplay(); }

  function percent(){
    try {
  const tokens = current.split(/(\+|\-|\*|\/)/);
      const last = tokens.pop() || '';
      if(last === '') return;
      const num = parseFloat(last);
      if(isNaN(num)) return;
      tokens.push((num/100).toString());
      current = tokens.join('');
      updateDisplay();
    } catch(e){}
  }

  function calculate(){
    if(!current) return;
    const expr = current.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
    try {
      if(/[a-zA-Z]/.test(expr)) throw 'Invalid';
      const result = Function('return ('+expr+')')();
      current = String(result);
      updateDisplay();
    } catch(e){
      display.textContent = 'Error';
      current = '';
    }
  }

  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const v = btn.getAttribute('data-value');
      const action = btn.getAttribute('data-action');
      if(action){
        if(action === 'clear') clearAll();
        else if(action === 'back') backspace();
        else if(action === 'percent') percent();
        else if(action === 'equals') calculate();
      } else if(v){
        append(v);
      }
    });
  });

  window.addEventListener('keydown', (e)=>{
    if((e.key >= '0' && e.key <= '9') || ['+','-','*','/','.','%'].includes(e.key)){
      append(e.key);
    } else if(e.key === 'Enter' || e.key === '='){
      calculate();
    } else if(e.key === 'Backspace'){
      backspace();
    } else if(e.key === 'Escape'){
      clearAll();
    }
  });
})();
