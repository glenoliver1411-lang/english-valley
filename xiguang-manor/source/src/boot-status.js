export function bootStatus(phase,progress){
  window.dispatchEvent(new CustomEvent('manor:boot',{detail:{phase,progress}}));
}
