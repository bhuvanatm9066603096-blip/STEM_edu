document.addEventListener("DOMContentLoaded", () => {

    const mathCard = document.getElementById("mathCard");
    const biologyCard = document.getElementById("biologyCard");

    const mathButton = document.getElementById("openMath");
    const biologyButton = document.getElementById("openBiology");

    /*
     * -----------------------------
     * NAVIGATION
     * -----------------------------
     */

    function openMathVerse() {
        window.location.href = mathButton ? mathButton.href : "/mathverse/";
    }

    function openBiologyLab() {
        window.location.href = biologyButton ? biologyButton.href : "/biology/";
    }


    /*
     * -----------------------------
     * CARD CLICK
     * -----------------------------
     */

    if (mathCard) {
        mathCard.addEventListener("click", (event) => {

            if (
                event.target.closest(".open-lab")
            ) {
                return;
            }

            openMathVerse();
        });
    }


    if (biologyCard) {
        biologyCard.addEventListener("click", (event) => {

            if (
                event.target.closest(".open-lab")
            ) {
                return;
            }

            openBiologyLab();
        });
    }


    /*
     * -----------------------------
     * BUTTONS
     * -----------------------------
     */

    if (mathButton) {
        mathButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openMathVerse();
            }
        );
    }


    if (biologyButton) {
        biologyButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openBiologyLab();
            }
        );
    }


    /*
     * -----------------------------
     * BACKEND CONNECTION CHECK
     * -----------------------------
     */

    if (window.location.protocol === "file:") {
        console.info(
            "VISGEN backend health check requires the page to be served over HTTP."
        );
    } else {
        fetch("/api/health")
            .then(response => response.json())
            .then(data => {

                console.log(
                    "VISGEN backend:",
                    data
                );

            })
            .catch(error => {

                console.warn(
                    "Backend connection failed:",
                    error
                );

            });
    }
    document.addEventListener("DOMContentLoaded", () => {

    loadSubjects();

    setupNavigation();

});


async function loadSubjects() {

    const container = document.getElementById("subjects");

    if (!container) {
        return;
    }

    try {

        const response = await fetch("data/subjects.json");

        if (!response.ok) {
            throw new Error("Unable to load subjects.json");
        }

        const data = await response.json();

        container.innerHTML = "";

        data.subjects.forEach(subject => {

            const card = document.createElement("div");

            card.className = "subject-card";

            card.innerHTML = `
                <div class="subject-icon">
                    ${subject.icon}
                </div>

                <h3>${subject.name}</h3>

                <p>
                    ${subject.description}
                </p>

                <button
                    class="subject-btn"
                    data-page="${subject.page}"
                    ${!subject.available ? "disabled" : ""}
                >
                    ${subject.available
                        ? "Explore →"
                        : "Coming Soon"}
                </button>
            `;

            const button =
                card.querySelector(".subject-btn");

            if (subject.available) {

                button.addEventListener("click", () => {

                    window.location.href =
                        subject.page;

                });

            }

            container.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="error-card">
                Unable to load STEM subjects.
            </div>
        `;

    }

}


function setupNavigation() {

    const nav =
        document.querySelector(".navbar");

    if (!nav) {
        return;
    }

    window.addEventListener("scroll", () => {

        if (window.scrollY > 30) {
            nav.classList.add("scrolled");
        }

        else {
            nav.classList.remove("scrolled");
        }

    });

}


    /*
     * -----------------------------
     * SIMPLE HOVER EFFECT
     * -----------------------------
     */

    const cards =
        document.querySelectorAll(".lab-card");

    cards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const rotateY =
                    ((x / rect.width) - 0.5) * 4;

                const rotateX =
                    ((y / rect.height) - 0.5) * -4;

                card.style.transform =
                    `translateY(-8px)
                     perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;
            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });

});