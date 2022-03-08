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
        };
        this.handleNumberButton = this.handleNumberButton.bind(this);
        this.handleClearMemory = this.handleClearMemory.bind(this);
        this.handleOperators = this.handleOperators.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.makeCalculation = this.makeCalculation.bind(this);
    }

    handleClearMemory(e) {
        if (!e) {
            this.setState({ displayMemory: [], display: "" });
            return;
        }
        e.target.classList.add("clicked");
        this.setState({ displayMemory: [], display: "" });
    }

    handleOperators(e) {
        let clickedButton = e.target;
        if (e.target.tagName === "SPAN") {
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
                newDisplayMemoryArray.pop();
                newDisplayMemoryArray.push(clickedOperator);
            } else if (/(\+|\*|\/)$/.test(state.displayMemory.join(""))) {
                newDisplayMemoryArray.pop();
                newDisplayMemoryArray.push(clickedOperator);
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
        let clickedButton = e.target;
        if (e.target.tagName === "SPAN") {
            clickedButton = e.target.closest("button");
        }
        clickedButton.classList.add("clicked");

        if (clickedButton.value === "0" && this.state.display === "") return;

        if (this.state.equalHasBeenClicked) {
            this.handleClearMemory();
            this.setState({ equalHasBeenClicked: false });
        }

        this.setState((state, props) => {
            return {
                displayMemory: state.displayMemory.concat(clickedButton.value),
                display: state.display.concat(clickedButton.value),
            };
        });
    }

    handleDecimal(e) {
        e.target.classList.add("clicked");
        this.setState((state, props) => {
            const hasDecimalDot = state.display.includes(".");
            if (!hasDecimalDot) {
                return {
                    displayMemory: state.displayMemory.concat(e.target.value),
                    display: state.display.concat(e.target.value),
                };
            }
        });
    }

    makeCalculation(e) {
        e.target.classList.add("clicked");
        const mathResult = eval(
            "'use strict';" + this.state.displayMemory.join("")
        );

        console.log(mathResult);
        this.setState((state, props) => ({
            displayMemory: state.displayMemory.concat("=" + mathResult),
            operationResult: mathResult,
            display: mathResult,
            equalHasBeenClicked: true,
        }));
    }

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
                <div id="display">{this.props.display || 0}</div>
            </div>
        );
    }
}

export default App;
