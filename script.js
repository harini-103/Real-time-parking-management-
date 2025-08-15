const slots = Array(7).fill(null);

function renderSlots() {
    const leftParking = document.getElementById("leftParking");
    const rightParking = document.getElementById("rightParking"); 
    leftParking.innerHTML = "";
    rightParking.innerHTML = "";
    slots.forEach((slot, index) => {
        const div = document.createElement("div");
        div.className = "slot" + (slot ? " occupied" : "");
        div.innerHTML = slot ? `${slot.car}<br>${slot.timeLeft} min` : `Slot ${index + 1}`;
        if (slot) {
            const removeBtn = document.createElement("button");
            removeBtn.innerText = "Remove";
            removeBtn.className = "remove-btn";
            removeBtn.onclick = () => removeCar(index);
            div.appendChild(removeBtn);
        }
        if (index < 4) {
            leftParking.appendChild(div);
        } else {
            rightParking.appendChild(div);
        }
    });
}

function parkCar() {
    const carNumber = document.getElementById("carNumber").value;
    const duration = parseInt(document.getElementById("duration").value, 10);
    if (!carNumber || isNaN(duration) || duration <= 0) return alert("Enter valid details");

    const freeIndex = slots.findIndex(slot => slot === null);
    if (freeIndex === -1) return alert("No available slots");

    slots[freeIndex] = { car: carNumber, timeLeft: duration, overdue: 0, alerted: false, fineAlerted: false };

    // First Notification: Parking Confirmation
    alert(`Your car is parked in Slot ${freeIndex + 1} for ${duration} minutes.`);

    startTimer(freeIndex);
    renderSlots();
}

function startTimer(index) {
    const interval = setInterval(() => {
        if (!slots[index]) return clearInterval(interval);
        if (slots[index].timeLeft > 0) {
            slots[index].timeLeft--;
        } 
        else if (slots[index].timeLeft === 0 && !slots[index].alerted) {
            //First alert: Time is up
            alert(`Time is up for Slot ${index + 1}! Please remove the car, or a fine will be charged.`);
            slots[index].alerted = true;
            //Wait for 3 seconds before allowing fine calculation
            setTimeout(() => {
                slots[index].timeLeft--; // Now goes to -1
                renderSlots();
            }, 3000);
        } 
        else if (slots[index].timeLeft <= 0) {
            //Fine starts accumulating at -1 min
            slots[index].timeLeft--;
            slots[index].overdue += 3; // Fine increases every 3 minutes
        }
        renderSlots();
    }, 3000); // 1 min = 3 sec in real time
}

function removeCar(index) {
    if (slots[index].overdue > 0) {
        const fine = (slots[index].overdue / 3) * 10;
        //Third Notification: Fine Alert
        alert(`You need to pay a fine. Click OK to proceed.`);
        //Final Notification: Fine Paid Confirmation
        alert(`Fine of Rs. ${fine} is paid. Thank you!`);
    }
    slots[index] = null;
    renderSlots();
}

renderSlots();
