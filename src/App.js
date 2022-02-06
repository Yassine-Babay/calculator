import { useReducer } from "react";
import DigitButton from "./component/DigitButton";
import OperationButton from "./component/OperationButton";
import "./App.css";

export const ACTION = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-ditgit",
  EVALUATE: "evaluate",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentNumber: payload.digit,
        };
      }
      if (
        (payload.digit === "0" && state.currentNumber === "0") ||
        (payload.digit === "00" && state.currentNumber === "00") ||
        (payload.digit === "000" && state.currentNumber === "000")
      )
        return state;
      if (payload.digit === "." && state.currentNumber.includes("."))
        return state;
      return {
        ...state,
        currentNumber: `${state.currentNumber || ""}${payload.digit}`,
      };
    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentNumber: null,
        };
      }
      if (state.currentNumber == null) return state;
      if (state.currentNumber.lenght === 1) {
        return {
          ...state,
          currentNumber: null,
        };
      }
      return {
        ...state,
        currentNumber: state.currentNumber.slice(0, -1),
      };
    case ACTION.CHOOSE_OPERATION:
      if (state.currentNumber == null && state.previousNumber == null) {
        return state;
      }
      if (state.previousNumber == null) {
        return {
          ...state,
          operation: payload.operation,
          previousNumber: state.currentNumber,
          currentNumber: null,
        };
      }

      if (state.currentNumber == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      return {
        ...state,
        previousNumber: evaluate(state),
        operation: payload.opertation,
        currentNumber: null,
      };
    case ACTION.CLEAR:
      return {};
    case ACTION.EVALUATE:
      if (
        state.operation == null ||
        state.previousNumber == null ||
        state.currentNumber == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousNumber: null,
        operation: null,
        currentNumber: evaluate(state),
      };
  }
};

const evaluate = ({ currentNumber, previousNumber, operation }) => {
  const prev = parseFloat(previousNumber);
  const curr = parseFloat(currentNumber);
  if (isNaN(prev) || isNaN(curr)) {
    return "";
  }
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "e":
      computation = prev ** curr;
      break;
    case "√":
      computation = prev ** (1 / curr);
      break;
  }

  return computation;
};

// *if someone can help me with this part it makes the app craches
// const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
//   maximumFractionDigits: 0,
// });

// const formatOpperand = (operand) => {
//   if (operand == null) return;
//   const [integer, decimal] = operand.split(".");
//   if (decimal == null) return INTEGER_FORMATTER.format(integer);
//   return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
// };

const App = () => {
  const [{ currentNumber, previousNumber, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previousNumber">
          {/* {formatOpperand(previousNumber)} {operation} */}
          {previousNumber} {operation}
        </div>
        <div className="currentNumber">
          {/* {formatOpperand(currentNumber)} */}
          {currentNumber}
        </div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation={"÷"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />
      <OperationButton operation={"*"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />
      <OperationButton operation={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />
      <OperationButton operation={"-"} dispatch={dispatch} />
      <DigitButton digit={"00"} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />
      <DigitButton digit={"000"} dispatch={dispatch} />
      <OperationButton operation={"√"} dispatch={dispatch} />
      <OperationButton operation={"E"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION.EVALUATE })}
      >
        =
      </button>
    </div>
  );
};

export default App;
