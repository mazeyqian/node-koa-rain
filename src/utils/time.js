function time (user) {
  const dt = new Date(user);
  const y = dt.getFullYear();
  const m = padZero(dt.getMonth() + 1);
  const d = padZero(dt.getDate());

  const hh = padZero(dt.getHours());
  const mm = padZero(dt.getMinutes());
  const ss = padZero(dt.getSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}
function padZero (user) {
  return user > 9 ? user : `0${user}`;
}

module.exports = {
  time,
};
