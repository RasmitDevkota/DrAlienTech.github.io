// Constraints - 28
const constraints = [
    // Top - 4
    "constraint_top-top",
    "constraint_top-bottom",
    // "constraint_top-start",
    // "constraint_top-end",
    // Bottom - 4
    "constraint_bottom-top",
    "constraint_bottom-bottom",
    // "constraint_bottom-start",
    // "constraint_bottom-end",
    // Left - 4
    "constraint_left-left",
    "constraint_left-right",
    // "constraint_left-start",
    // "constraint_left-end",
    // Right - 4
    "constraint_right-left",
    "constraint_right-right",
    // "constraint_right-start",
    // "constraint_right-end",
    // Start - 6
    // "constraint_start-top",
    // "constraint_start-bottom",
    // "constraint_start-left",
    // "constraint_start-right",
    // "constraint_start-start",
    // "constraint_start-end",
    // // End - 6
    // "constraint_end-top",
    // "constraint_end-bottom",
    // "constraint_end-left",
    // "constraint_end-right",
    // "constraint_end-start",
    // "constraint_end-end",
];

const width = window.innerWidth;
const height = window.innerHeight;

const chains = new Map();
chains.set("vertical", []);
chains.set("horizontal", []);

window.onload = function () {
    for (const constraintElement of document.getElementsByClassName("constraint")) {
        for (const attribute of constraintElement.attributes) {
            if (constraints.includes(attribute.name)) {
                const origin = attribute.name.split("-")[0].split("_")[1];
                const anchor = attribute.name.split("-")[1];

                if (["top", "bottom"].some((position) => [origin, anchor].includes(position))) {
                    chains.set("vertical", chains.get("vertical").push([constraintElement.id, origin, anchor, attribute.name]));
                    console.log([constraintElement.id, origin, anchor, attribute.name]);
                } else if (["left", "right"].some((position) => [origin, anchor].includes(position))) {
                    chains.set("horizontal", chains.get("vertical").push([constraintElement.id, origin, anchor, attribute.name]));
                    console.log([constraintElement.id, origin, anchor, attribute.name]);
                } else {
                    console.error(`Constraint "${attribute.name}" not found`);
                }
            }
        }
    }

    console.log(chains);
}