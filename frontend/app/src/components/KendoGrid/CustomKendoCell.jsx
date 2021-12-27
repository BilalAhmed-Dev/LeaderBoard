import React from "react";
import { GRID_COL_INDEX_ATTRIBUTE } from "@progress/kendo-react-grid";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import { useSelector } from "react-redux";

export const CustomCell = (props) => {
  const { status, userId } = useSelector((state) => state.userAuth);

  const field = props.field || "";
  const value = props.dataItem[field];
  const navigationAttributes = useTableKeyboardNavigation(props.id);
  return (
    <td
      // backgroundColor:
      // value > 0
      //   ? "#D1F4C2"
      //   : value < 0
      //   ? "#F4C2CA"
      //   : value === 0
      //   ? "#FFFFCC"
      //   : value === userId
      //   ? "red"
      //   : "",
      style={{
        color: value > 0 ? "green" : value < 0 ? "red" : "#CCCC00",
      }}
      colSpan={props.colSpan}
      role={"gridcell"}
      aria-colindex={props.ariaColumnIndex}
      aria-selected={props.isSelected}
      {...{
        [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex,
      }}
      {...navigationAttributes}
    >
      {value === null
        ? ""
        : // : typeof value === "string"
          // ? value
          Math.abs(props.dataItem[field]).toString()}
    </td>
  );
};
