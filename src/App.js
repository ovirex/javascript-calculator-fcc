import React from "react";
import "./App.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "",
            displayMemory: [],
            operationResult: 0,
            equalHasBeenClicked: false,
            digitLimitTimeout: 0,
        };
        this.handleNumberButton = this.handleNumberButton.bind(this);
        this.handleClearMemory = this.handleClearMemory.bind(this);
        this.handleOperators = this.handleOperators.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.makeCalculation = this.makeCalculation.bind(this);
        this.handleDigitLimit = this.handleDigitLimit.bind(this);
        this.handleClearDigitLimit = this.handleClearDigitLimit.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.handleCalculation = this.handleCalculation.bind(this);
    }

    // Methods
    handleClearMemory(e = false, pressBtn = true) {
        this.handleClearDigitLimit();
        if (pressBtn) {
            let clearBtn =
                e.target || document.querySelector("button[value='AC']");
            if (clearBtn.tagName === "SPAN") {
                clearBtn = e.target.closest("button");
            }
            clearBtn.classList.add("clicked");
        }
        this.setState({ displayMemory: [], display: "" });
    }

    handleOperators(e) {
        this.handleClearDigitLimit();

        let clickedButton =
            e.target ||
            document.querySelector(`button[value='${e.replace(/\*/i, "X")}']`);
        if (clickedButton.tagName === "SPAN") {
            clickedButton = e.target.closest("button");
        }

        clickedButton.classList.add("clicked");

        const clickedOperator = clickedButton.value.replace(/x/i, "*");

        if (this.state.equalHasBeenClicked) {
            this.setState((state, props) => {
                return {
                    equalHasBeenClicked: false,
                    displayMemory: [state.operationResult],
                };
            });
        }

        this.setState((state, props) => {
            if (state.displayMemory[state.displayMemory.length - 1] === ".") {
                const newDisMem = state.displayMemory;
                newDisMem.pop();
                return {
                    displayMemory: newDisMem,
                };
            }
        });

        this.setState((state, props) => {
            const newDisplayMemoryArray = [...state.displayMemory];
            if (/(\+|-|\*|\/){2}?$/.test(state.displayMemory.join(""))) {
                newDisplayMemoryArray.splice(
                    newDisplayMemoryArray.length - 2,
                    2
                );
                newDisplayMemoryArray.push(clickedOperator);
            } else if (
                /(\+|-|\*|\/)$/.test(state.displayMemory.join("")) &&
                clickedOperator === "-"
            ) {
                newDisplayMemoryArray.push("-");
            } else if (
                /(-)$/.test(state.displayMemory.join("")) &&
                /(\+|\*|\/)/.test(clickedOperator)
            ) {
                newDisplayMemoryArray.splice(-1, 1, clickedOperator);
            } else if (/(\+|\*|\/)$/.test(state.displayMemory.join(""))) {
                newDisplayMemoryArray.splice(-1, 1, clickedOperator);
            } else {
                newDisplayMemoryArray.push(clickedOperator);
            }

            return {
                displayMemory: newDisplayMemoryArray,
                display: clickedOperator,
            };
        });
    }

    handleNumberButton(e) {
        let clickedButton =
            e.target || document.querySelector(`button[value='${e}']`);

        if (clickedButton.tagName === "SPAN") {
            clickedButton = e.target.closest("button");
        }
        clickedButton.classList.add("clicked");

        if (!this.state.display.includes(".")) {
            if (
                clickedButton.value === "0" &&
                (this.state.display[0] === "0" ||
                    /(\+|-|\*|\/)0/.test(this.state.display))
            )
                return;
        }

        if (this.state.equalHasBeenClicked) {
            this.handleClearMemory(false, false);
            this.setState({ equalHasBeenClicked: false });
        }

        if (this.handleDigitLimit()) return;

        if (
            (this.state.display[0] === "0" &&
                !this.state.display.includes(".") &&
                clickedButton.value !== "0") ||
            (/(\+|-|\*|\/)0/.test(this.state.display) &&
                !this.state.display.includes("."))
        ) {
            this.setState((state, props) => ({
                display: state.display.replace("0", clickedButton.value),
            }));
            this.setState((state, props) => {
                const replace = state.displayMemory;
                replace.pop();
                replace.push(clickedButton.value);
                return {
                    displayMemory: replace,
                };
            });
            return;
        }
        this.setState((state, props) => {
            return {
                displayMemory: state.displayMemory.concat(clickedButton.value),
                display: state.display.concat(clickedButton.value),
            };
        });
    }

    handleDigitLimit() {
        const display = document.querySelector("#display");
        const displayContent = display.querySelector("span");

        if (
            displayContent.offsetWidth >= display.offsetWidth - 30 ||
            displayContent.classList.contains("limit")
        ) {
            displayContent.textContent = "Digit Limit Met";
            displayContent.classList.add("limit");

            clearTimeout(this.state.digitLimitTimeout);

            const timeoutID = setTimeout(() => {
                displayContent.textContent = this.state.display;
            }, 1500);

            this.setState({ digitLimitTimeout: timeoutID });

            return true;
        }

        return false;
    }

    handleClearDigitLimit() {
        const displayContent = document.querySelector("#display span");
        displayContent.classList.remove("limit");
    }

    handleDecimal(e = false) {
        let decimalBtn =
            e.target || document.querySelector("button[value='.']");
        decimalBtn.classList.add("clicked");

        if (this.handleDigitLimit()) return;

        this.setState((state, props) => {
            const hasDecimalDot = state.display.includes(".");
            if (!hasDecimalDot) {
                if (
                    state.display === "" ||
                    /^(\+|-|\*|\/)(?!\d)/.test(this.state.display)
                ) {
                    return {
                        displayMemory: state.displayMemory.concat(
                            "0" + decimalBtn.value
                        ),
                        display: state.display.concat("0" + decimalBtn.value),
                    };
                }
                return {
                    displayMemory: state.displayMemory.concat(decimalBtn.value),
                    display: state.display.concat(decimalBtn.value),
                };
            }
        });
    }

    makeCalculation(e = false) {
        let equalBtn = e.target || document.querySelector("button[value='=']");
        if (equalBtn.tagName === "SPAN") {
            equalBtn = e.target.closest("button");
        }
        equalBtn.classList.add("clicked");

        // eslint-disable-next-line no-eval
        console.log({ eval: this.state.displayMemory.join("") });

        const toEvaluate = this.state.displayMemory;
        let mathResult = 0;
        if (this.state.equalHasBeenClicked) {
            toEvaluate.pop();
            mathResult = this.handleCalculation(toEvaluate);
        } else {
            mathResult = this.handleCalculation(toEvaluate);
        }

        this.setState((state, props) => ({
            displayMemory: state.displayMemory.concat("=" + mathResult),
            operationResult: mathResult,
            display: "" + mathResult,
            equalHasBeenClicked: true,
        }));
    }

    handleCalculation(operationArray) {
        let operation = operationArray;
        let counter = 0;
        let currentOperator = "";
        let nextOperator = "";
        let a = "";
        let b = "";
        let acumOperationResult = 0;
        // Search for the multiplications/divisions
        const regex =
            /(-\d+\.?\d+|\d+\.\d+|\d+)(\*|\/)(\d+\.\d+|-\d+\.?\d+|-?\d+)/;

        let result = 0;

        if (
            !regex.test(operation.join("")) &&
            /\d+|^-\d+/.test(operation.join(""))
        ) {
            result = +operation.join("");
        }
        while (regex.test(operation.join(""))) {
            let operationString = operation.join("");
            const factors = operationString.match(regex);

            const [, factor1, operationSymbol, factor2] = factors;

            switch (operationSymbol) {
                case "*":
                    result = +factor1 * +factor2;
                    break;
                case "/":
                    result = +factor1 / +factor2;
                    break;

                default:
                    break;
            }
            operationString = operationString.replace(regex, result.toString());
            operation = operationString.split("");
        }

        do {
            if (
                !/(\+|-|\*|\/)/.test(operation.join("")) ||
                /^-\d+/.test(operation.join(""))
            ) {
                acumOperationResult = result;
                break;
            }

            let forStart = counter;

            for (let i = forStart; i < operation.length; i++) {
                counter++;
                if (currentOperator && a.length > 0) {
                    if (isAOperator(operation[i])) {
                        /* Check if the operator means that the number is negative 
                        or if it is the nextOperator */
                        if (b.length > 0) {
                            nextOperator = operation[i];
                        } else {
                            const temp = b.split("");
                            temp.push(operation[i]);
                            b = temp.join("");
                        }
                    } else {
                        const temp = b.split("");
                        temp.push(operation[i]);
                        b = temp.join("");
                    }
                } else {
                    if (isAOperator(operation[i])) {
                        currentOperator = operation[i];
                    } else {
                        const temp = a.split("");
                        temp.push(operation[i]);
                        a = temp.join("");
                    }
                }

                if (currentOperator && nextOperator && a && b) break;
            }
            switch (currentOperator) {
                case "+":
                    acumOperationResult = +a + +b;
                    a = "" + acumOperationResult;
                    b = "";
                    currentOperator = nextOperator;
                    nextOperator = "";
                    break;
                case "-":
                    acumOperationResult = +a - +b;
                    a = "" + acumOperationResult;
                    b = "";
                    currentOperator = nextOperator;
                    nextOperator = "";
                    break;
                case "*":
                    acumOperationResult = +a * +b;
                    a = "" + acumOperationResult;
                    b = "";
                    currentOperator = nextOperator;
                    nextOperator = "";
                    break;
                case "/":
                    acumOperationResult = +a / +b;
                    a = "" + acumOperationResult;
                    b = "";
                    currentOperator = nextOperator;
                    nextOperator = "";
                    break;

                default:
                    break;
            }
        } while (operation.length > counter);

        console.log(acumOperationResult);
        return acumOperationResult;

        function isAOperator(element) {
            if (/\d/i.test(element)) return false;

            if (/(\+|-|\*|\/)/.test(element)) return true;
        }
    }

    handleDeleteItem(e = false) {
        let deleteBtn =
            e.target || document.querySelector("button[value='Back']");
        if (deleteBtn.tagName === "SPAN") {
            deleteBtn = e.target.closest("button");
        }
        deleteBtn.classList.add("clicked");

        if (this.state.equalHasBeenClicked) {
            this.handleClearMemory(false, false);
            return;
        }

        this.setState((state, props) => {
            let newDisplayMemory = state.displayMemory;
            let newDisplay = state.display.split("");
            newDisplayMemory.pop();
            newDisplay.pop();

            return {
                displayMemory: newDisplayMemory,
                display: newDisplay.join(""),
            };
        });
    }

    handleKeyboard(event) {
        const clickedKey = event.key;

        if (/\d/i.test(clickedKey)) this.handleNumberButton(clickedKey);

        if (/\./i.test(clickedKey)) this.handleDecimal();

        if (/(\+|-|\*|\/)/.test(clickedKey)) this.handleOperators(clickedKey);

        if (/enter/i.test(clickedKey)) this.makeCalculation();

        if (/backspace/i.test(clickedKey)) this.handleDeleteItem();

        if (/escape/i.test(clickedKey)) this.handleClearMemory();
    }
    /* ******************* */

    // Lifecycles
    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyboard);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyboard);
    }
    /* ******************* */

    render() {
        return (
            <div style={{ margin: "0 auto", textAlign: "center" }}>
                <div className="App">
                    <AppDisplay
                        toDisplay={this.state.displayMemory}
                        display={this.state.display}
                    />
                    <AppButton
                        key-value="AC"
                        id="clear"
                        button-function={this.handleClearMemory}
                    />
                    <AppButton
                        key-value="Back"
                        id="delete"
                        button-function={this.handleDeleteItem}
                    />
                    <AppButton
                        key-value="/"
                        id="divide"
                        key-type="operator"
                        button-function={this.handleOperators}
                    />
                    <AppButton
                        key-value="X"
                        id="multiply"
                        key-type="operator"
                        button-function={this.handleOperators}
                    />
                    <AppButton
                        key-value="7"
                        id="seven"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="8"
                        id="eight"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="9"
                        id="nine"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="-"
                        id="subtract"
                        key-type="operator"
                        button-function={this.handleOperators}
                    />
                    <AppButton
                        key-value="4"
                        id="four"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="5"
                        id="five"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="6"
                        id="six"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="+"
                        id="add"
                        key-type="number"
                        button-function={this.handleOperators}
                    />
                    <AppButton
                        key-value="1"
                        id="one"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="2"
                        id="two"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="3"
                        id="three"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="="
                        id="equals"
                        key-type="operator"
                        button-function={this.makeCalculation}
                    />
                    <AppButton
                        key-value="0"
                        id="zero"
                        key-type="number"
                        button-function={this.handleNumberButton}
                    />
                    <AppButton
                        key-value="."
                        id="decimal"
                        button-function={this.handleDecimal}
                    />
                </div>
                <p>
                    By{" "}
                    <a
                        href="https://ovidio.welikeperas.com"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#fff" }}
                    >
                        Ovidio Pérez
                    </a>
                </p>
            </div>
        );
    }
}

class AppButton extends React.Component {
    render() {
        return (
            <button
                id={this.props.id}
                className="button"
                onClick={this.props["button-function"]}
                onTransitionEnd={(e) => e.target.classList.remove("clicked")}
                value={this.props["key-value"]}
                data-key-type={this.props["key-type"]}
            >
                <span>{this.props["key-value"]}</span>
            </button>
        );
    }
}

class AppDisplay extends React.Component {
    render() {
        return (
            <div id="calculator-display">
                <div className="memory">
                    <span>{this.props.toDisplay.join("")}</span>
                </div>
                <div id="display">
                    <span>{this.props.display || 0}</span>
                </div>
            </div>
        );
    }
}

export default App;
