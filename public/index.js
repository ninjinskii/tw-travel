const INPUT_ARRIVAL = "arrival"
const INPUT_WALK_TIME = "walk-time"
const INPUT_DAYS_OFFSET = "days-offset"
const TIME_LENGTH = 8 // "00:00:00".length

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

function computeTime(unparsedArrival, unparsedWalkTime, daysOffset) { 
  const arrival = parseStringDate(unparsedArrival)
  const [hour, minute, second] = unparsedWalkTime.split(":")
  const walkTime = hour * 3600000 + minute * 60000 + second * 1000
  const totalWalkTime = walkTime * 2

  const offset = arrival.getDate() + parseInt(daysOffset)
  arrival.setDate(offset)

  return new Date(arrival.getTime() - totalWalkTime).toLocaleString()
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

function maybeAutocompleteColon(inputId) {
  if (isInputFilled(inputId)) {
    return
  }

  const input = document.getElementById(inputId)
  const clearValue =  input.value.replace(/:/g, '')

  if (clearValue.length % 2 === 0) {
    if(input.value.split("").pop() === ":" || clearValue.length === 0) {
      input.value = input.value.slice(0, -1)
    } else {
      input.value += ":"
    }
  }

}

function onInputChanged(inputId) {
  if (inputId != undefined) {
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

  if (isInputFilled(INPUT_ARRIVAL) && isInputFilled(INPUT_WALK_TIME)) {
    const arrival = document.getElementById(INPUT_ARRIVAL).value
    const walkTime = document.getElementById(INPUT_WALK_TIME).value
    const daysOffset = document.getElementById(INPUT_DAYS_OFFSET).value
    const result = computeTime(arrival, walkTime, daysOffset)

    const div = document.getElementById("result")
    div.innerHTML = result

    const returnDiv = document.getElementById("return")
    const returnTime = parseStringDate(arrival).toLocaleString()
    returnDiv.innerHTML = returnTime + ":000"

    document.title = "Départ à: " + result.split(' ')[1] + " (pour snipe l'attaque arrivant à " + returnTime + ":xxx)"
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === "Backspace") {
    event.target.value = ""
  }
});
