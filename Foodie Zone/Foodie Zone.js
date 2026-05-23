// Smooth scroll and fade-in effect
document.querySelectorAll('.navbar .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);

        if (target) {
            // Fade out body
            document.body.classList.add('page-transition-out');

            setTimeout(() => {
                // Scroll to target section
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                // After scrolling, fade in body
                setTimeout(() => {
                    document.body.classList.remove('page-transition-out');
                    document.body.classList.add('page-transition-in');

                    // Remove fade-in after animation completes
                    setTimeout(() => {
                        document.body.classList.remove('page-transition-in');
                    }, 800);
                }, 500);
            }, 300);
        }
    });
});

// Fade-in nav items on load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.navbar .nav-link').forEach((link, i) => {
        setTimeout(() => {
            link.classList.add('nav-appear');
        }, i * 100);
    });
});

//Table Booking Form JS//
function showForm() {
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('homeSection').style.display = 'none'; // hide home section
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function showHome() {
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('homeSection').style.display = 'flex'; // flex since it's a banner section
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function goToHome() {
    // Scroll smoothly to the top/home section
    const homeSection = document.getElementById('homeSection');
    homeSection.scrollIntoView({
        behavior: 'smooth'
    });

    // Hide the booking form after a short delay (for smooth UX)
    setTimeout(() => {
        document.getElementById('bookingForm').style.display = 'none';
    }, 600); // wait for scroll animation to finish
}


function confirmBooking(event) {
    event.preventDefault(); // Stop actual form submission

    const form = document.getElementById('tableForm');
    if (form.checkValidity()) {
        const name = form.name.value;
        const email = form.email.value;
        const date = form.date.value;
        const time = form.time.value;
        const guests = form.guests.value;
        const area = form.area.value;

        alert(`Thank you ${name}!\n\nYou have reserved a table for ${guests} members on ${date} at ${time} in the ${area} area.\nConfirmation has been sent to: ${email}`);

        form.reset(); // Clear form
        return true;
    } else {
        return false;
    }
}

//Table Booking Form Ending//

const numbersDiv = document.getElementById('numbers');
const spinButton = document.getElementById('spinButton');
const nameInput = document.getElementById('nameInput');
const couponInput = document.getElementById('couponInput'); // ✅ New input
const result = document.getElementById('result');
const spinnerContainer = document.querySelector(".spinner-container");

const totalNumbers = 100;
const itemHeight = 60;
let animationFrameId;
let startTimestamp = null;
let currentPosition = 0;
let spinning = false;
let speed = 0;

const usedNames = new Set(); // ✅ Track used names
const validCoupons = new Set(['9XQ4M7LZ2A1B', '7F2X8L9QK1ZT', 'H3N5YB6D2WCU']); // ✅ Sample valid coupons

function formatNumber(n) {
    return n < 10 ? '0' + n : n;
}

function populateNumbers() {
    let html = '';
    for (let rep = 0; rep < 3; rep++) {
        for (let i = 1; i <= totalNumbers; i++) {
            html += `<div class="number">${formatNumber(i)}</div>`;
        }
    }
    numbersDiv.innerHTML = html;
}
populateNumbers();

function animateScroll(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const elapsed = timestamp - startTimestamp;

    currentPosition += speed;

    if (currentPosition >= totalNumbers * itemHeight * 2) {
        currentPosition -= totalNumbers * itemHeight;
    }
    numbersDiv.style.transform = `translateY(${-currentPosition}px)`;

    if (spinning) {
        if (elapsed > 4000) {
            speed *= 0.95;
            if (speed < 0.2) {
                spinning = false;
                spinButton.disabled = false;
                cancelAnimationFrame(animationFrameId);
                finalizePosition();
                spinnerContainer.classList.remove("spinning");
                return;
            }
        }
        animationFrameId = requestAnimationFrame(animateScroll);
    }
}

function finalizePosition() {
    const offset = currentPosition % (totalNumbers * itemHeight);
    let index = Math.round(offset / itemHeight);
    if (index >= totalNumbers) index = 0;
    const discountNumber = index + 1;

    currentPosition = index * itemHeight;
    numbersDiv.style.transform = `translateY(${-currentPosition}px)`;

    const userName = nameInput.value.trim();

    result.style.opacity = 0;
    void result.offsetWidth;
    result.textContent = `${userName}, you got a ${formatNumber(discountNumber)}% discount! 🎉`;
    result.style.animation = "fadeIn 1s ease forwards";
}

document.getElementById('spinForm').addEventListener('submit', e => {
    e.preventDefault();
    if (spinning) return;

    const userName = nameInput.value.trim().toLowerCase();
    const couponCode = couponInput.value.trim().toUpperCase(); // ✅ Normalize input

    if (!userName || !couponCode) {
        alert('Please enter your name and coupon code!');
        return;
    }

    if (!validCoupons.has(couponCode)) {
        alert('Invalid coupon code! Please try again.');
        return;
    }

    if (usedNames.has(userName)) {
        alert(`Hi ${userName}, you’ve already spin the wheel!`);
        return;
    }

    usedNames.add(userName);

    spinning = true;
    spinButton.disabled = true;
    result.textContent = '';
    result.style.opacity = 0;
    spinnerContainer.classList.add("spinning");

    speed = 20 + Math.random() * 10;
    startTimestamp = null;
    animationFrameId = requestAnimationFrame(animateScroll);
});


function copyCoupon() {
    const couponText = document.querySelector(".coupon-code").innerText;
    navigator.clipboard.writeText(couponText);
    alert("Coupon code copied: " + couponText);
}