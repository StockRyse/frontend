document.addEventListener("DOMContentLoaded", () => {
    function setupThemeToggle() {
        // Wait a short moment to ensure DOM is fully loaded
        setTimeout(() => {
            const body = document.body;
            const modeToggle = document.getElementById("modeToggle");
            const toggleSwitch = modeToggle ? modeToggle.querySelector(".toggle-switch") : null;
            const toggleKnob = modeToggle ? modeToggle.querySelector(".toggle-knob") : null;

            if (!modeToggle || !toggleSwitch || !toggleKnob) {
                console.error("Theme toggle elements not found:", {
                    modeToggle: !!modeToggle,
                    toggleSwitch: !!toggleSwitch,
                    toggleKnob: !!toggleKnob
                });
                return;
            }

            function applyTheme(theme) {
                body.classList.remove("light-mode", "dark-mode");
                body.classList.add(theme);

                if (theme === "dark-mode") {
                    toggleSwitch.style.backgroundColor = "#666";
                    toggleKnob.style.left = "26px";
                } else {
                    toggleSwitch.style.backgroundColor = "#ccc";
                    toggleKnob.style.left = "2px";
                }

                localStorage.setItem("theme", theme);
            }

            // Initial theme setup
            const savedTheme = localStorage.getItem("theme") || "light-mode";
            applyTheme(savedTheme);

            // Remove any existing onclick to prevent multiple handlers
            modeToggle.onclick = null;

            // New click handler
            modeToggle.onclick = () => {
                const currentTheme = body.classList.contains("dark-mode") ? "light-mode" : "dark-mode";
                applyTheme(currentTheme);
            };
        }, 100);
    }

    // Initial setup
    setupThemeToggle();

    // Detect sidebar load and re-run setup
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        const observer = new MutationObserver((mutations) => {
            setupThemeToggle();
        });
        observer.observe(sidebarContainer, { childList: true });
    }
});