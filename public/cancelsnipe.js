const INPUT_ARRIVAL = "arrival"
const INPUT_WALK_TIME = "walk-time"
const INPUT_DAYS_OFFSET = "days-offset"
const TIME_LENGTH = 8 // "00:00:00".length

let counterIntervalId = -1
let target = -1
let cancelTarget = -1

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
  const walkTime = timeToMillis(hour, minute, second)
  const totalWalkTime = timeToMillis(hour, minute, second) * 2

  const offset = arrival.getDate() + parseInt(daysOffset)
  arrival.setDate(offset)

  target = arrival.getTime() - totalWalkTime
  cancelTarget = arrival.getTime() - walkTime

  return {
    launchTime: new Date(target).toLocaleString("fr"),
    cancelTime: new Date(cancelTarget).toLocaleString("fr"),
  }
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

  if (isInputFilled(INPUT_ARRIVAL) && isInputFilled(INPUT_WALK_TIME)) {
    const arrival = document.getElementById(INPUT_ARRIVAL).value
    const walkTime = document.getElementById(INPUT_WALK_TIME).value
    const daysOffset = document.getElementById(INPUT_DAYS_OFFSET).value
    const { launchTime, cancelTime } = computeTime(arrival, walkTime, daysOffset)
    const tooLate = Date.now() > target

    const tooLateDiv = document.getElementById("time-error")
    const div = document.getElementById("result")
    const div2 = document.getElementById("result-cancel")

    if (tooLate) {
      tooLateDiv.innerHTML = "Trop tard ! Réessayez avec un délai arbitraire plus petit !"
      div.innerHTML = ""
      div2.innerHTML = ""
      clearInterval(counterIntervalId)
      return
    }

    tooLateDiv.innerHTML = ""
    div.innerHTML = launchTime
    div2.innerHTML = cancelTime

    clearInterval(counterIntervalId)
    counterIntervalId = setInterval(setupCounter, 1000)
  }
}

function setupCounter() {
  const now = Date.now()
  const launchRemainingTime = now - target
  const launchRemainingSeconds = Math.floor(launchRemainingTime / 1000)
  const cancelRemainingTime = now - cancelTarget
  const cancelRemainingSeconds = Math.floor(cancelRemainingTime / 1000)

  const launchReached = launchRemainingSeconds * -1 <= 0
  const cancelReached = cancelRemainingSeconds * -1 <= 0

  console.log("launchRemainingSeconds")
  console.log(launchRemainingSeconds)
  console.log("cancelRemainingSeconds")
  console.log(cancelRemainingSeconds)
  
  if (!launchReached) {
    const formattedLaunchTime = new Date(target).toLocaleTimeString("fr")
    document.title = `${formattedLaunchTime} | Envoi: ${launchRemainingSeconds * -1}`
    return
  }
  
  const formattedCancelTime = new Date(cancelTarget).toLocaleTimeString("fr")

  if (!cancelReached) {
    document.title = `${formattedCancelTime} | Cancel: ${cancelRemainingSeconds * -1}`
    return
  }

  document.title = `${formattedCancelTime} | CANCEL !!`
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
