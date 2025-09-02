let id = 0;
function generateId() {
  return ++id;
}
function useId() {
  return "frappe-ui-" + generateId();
}
export {
  useId as u
};
