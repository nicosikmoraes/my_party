import { showMessage } from "react-native-flash-message";

const baseStyle = {
  animated: true,
  icon: "auto" as const,
  statusBarHeight: 35,
  titleStyle: {
    fontSize: 18,
  },
  backgroundColor: "#1A1A1A",
  color: "#fff",
  style: {
    borderLeftWidth: 5,
  },
};

function getBorderColor(type: "success" | "danger" | "warning" | "info") {
  switch (type) {
    case "success":
      return "#22c55e";
    case "danger":
      return "#ef4444";
    case "warning":
      return "#f59e0b";
    case "info":
      return "#E65C00";
    default:
      return "#E65C00";
  }
}

export function showToast(
  message: string,
  type: "success" | "danger" | "warning" | "info" = "info",
  description: string = "",
) {
  showMessage({
    message,
    description,
    type,
    ...baseStyle,
    style: {
      ...baseStyle.style,
      borderLeftColor: getBorderColor(type),
    },
  });
}
