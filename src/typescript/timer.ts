export const runTimer = (target : Element) => {
  setTimerVal(target);
};

const setTimerVal = (target : Element) => {
  const midnight = new Date();
  midnight.setHours( 24 );
  midnight.setMinutes( 0 );
  midnight.setSeconds( 0 );
  midnight.setMilliseconds( 0 );
  const countdownDate = midnight.getTime();
  // https://www.w3schools.com/howto/howto_js_countdown.asp
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countdownDate - now;

  // Time calculations for days, hours, minutes and seconds
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const pad = (str : string) => "0" + str;
  const hStr = hours.toString().length < 2 ? pad(hours.toString()) : hours.toString();
  const mStr = minutes.toString().length < 2 ? pad(minutes.toString()) : minutes.toString();
  const sStr = seconds.toString().length < 2 ? pad(seconds.toString()) : seconds.toString();


  // Display the result in the element with id="demo"
  target.textContent = `${hStr}:${mStr}:${sStr}`;

  // If the count down is finished, write some text
  if (distance < 0) {
    target.textContent = "NOW";
  } else {
    setTimeout(() => setTimerVal(target), 1000);
  }
};