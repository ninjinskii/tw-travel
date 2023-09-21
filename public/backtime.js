const INPUT_ARRIVAL = "arrival"
const INPUT_NEMESIS_WALK_TIME = "nemesis-walk-time"
const INPUT_WALK_TIME = "walk-time"
const INPUT_DAYS_OFFSET = "days-offset"
const TIME_LENGTH = 8 // "00:00:00".length

let counterIntervalId = -1
let target = -1
let nemesisReturnTime = -1

function checkDate(inputId) {
  const input = document.getElementById(inputId)
  const time = input.value.split(":")
  const [hour, minute, second] = time

  const isAllNumber = time.every(t => !isNaN(t))
  const isHourValid = hour >= 0 && hour < 24
  const isMinuteValid = minute >= 0 && minute < 60
  const isSecondValid = second >= 0 && second < 60

  return time.length === 3 && isAllNumber && isHourValid && isMinuteValid && isSecondValid
}

function computeTime(unparsedArrival, unparsedWalkTime, unparsedNemesisWalkTime, daysOffset) { 
  const arrival = parseStringDate(unparsedArrival)
  const [hour, minute, second] = unparsedWalkTime.split(":")
  const [hourNemesis, minuteNemesis, secondNemesis] = unparsedNemesisWalkTime.split(":")
  const walkTime = timeToMillis(hour, minute, second)
  const nemesisWalkTime = timeToMillis(hourNemesis, minuteNemesis, secondNemesis) 

  const offset = arrival.getDate() + parseInt(daysOffset)
  arrival.setDate(offset)

  target = arrival.getTime() + nemesisWalkTime - walkTime
  nemesisReturnTime = arrival.getTime() + nemesisWalkTime
  return new Date(arrival.getTime() + nemesisWalkTime - walkTime).toLocaleString("fr")
}

function parseStringDate(unparsed) {
  const [hour, minute, second] = unparsed.split(":")
  const result = new Date()
  result.setHours(hour)
  result.setMinutes(minute)
  result.setSeconds(second)

  return result
}

function isInputFilled(inputId) {
  const input = document.getElementById(inputId)
  return input.value.length === TIME_LENGTH
}

function timeToMillis(hour, minute, second) {
  return hour * 3600000 + minute * 60000 + second * 1000
}

function maybeAutocompleteColon(inputId) {
  if (isInputFilled(inputId)) {
    return
  }

  const input = document.getElementById(inputId)
  const clearValue =  input.value.replace(/:/g, '')

  if (clearValue.length % 2 === 0) {
    const lastChar = input.value.split("").pop()

    if (lastChar === ":" || clearValue.length === 0) {
      input.value = input.value.slice(0, -1)
    } else {
      input.value += ":"
    }
  }

}

// deno-lint-ignore no-unused-vars
function onInputChanged(inputId) {
  if (inputId !== undefined) {
    maybeAutocompleteColon(inputId)
  
    if (!isInputFilled(inputId)) {
      return
    }
  
    const div = document.getElementById(`${inputId}-error`)
    div.innerHTML = checkDate(inputId) ? "" : "La date saisie n'est pas valide"

    if (!checkDate(inputId)) {
      return
    }
  }

  if (isInputFilled(INPUT_ARRIVAL) && isInputFilled(INPUT_WALK_TIME) && isInputFilled(INPUT_NEMESIS_WALK_TIME)) {
    const arrival = document.getElementById(INPUT_ARRIVAL).value
    const walkTime = document.getElementById(INPUT_WALK_TIME).value
    const nemesisWalkTime = document.getElementById(INPUT_NEMESIS_WALK_TIME).value
    const daysOffset = document.getElementById(INPUT_DAYS_OFFSET).value
    const result = computeTime(arrival, walkTime, nemesisWalkTime, daysOffset)

    const div = document.getElementById("result")
    div.innerHTML = result

    const returnDiv = document.getElementById("return")
    const returnTime = new Date(nemesisReturnTime).toLocaleString("fr")
    returnDiv.innerHTML = returnTime + ":000"

    clearInterval(counterIntervalId)
    counterIntervalId = setInterval(setupCounter, 1000)
  }
}

function setupCounter() {
  const now = Date.now()
  const remainingTime = now - target
  const remainingSeconds = Math.floor(remainingTime / 1000)
  const reached = remainingSeconds * -1 <= 0
  document.title = `${new Date(target).toLocaleTimeString("fr")} | ${reached ? "GO !!" : remainingSeconds * -1}`
}

document.addEventListener('keydown', (event) => {
  if (event.key === "Backspace") {
    event.target.value = ""
  }
});

// deno-lint-ignore no-window-prefix
window.addEventListener('load', () => {
  document.getElementById(INPUT_ARRIVAL).focus()
})
