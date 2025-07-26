export const Card = ({
  children,
  className = "",
  hover = false,
  gradient = false,
  ...props
}) => {
  const baseClasses =
    "rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200";
  const hoverClasses = hover ? "hover:-translate-y-1 hover:shadow-lg" : "";
  const gradientClasses = gradient
    ? "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
    : "bg-white dark:bg-gray-800";

  const classes = [baseClasses, gradientClasses, hoverClasses, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => (
  <div
    className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "", ...props }) => (
  <div
    className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);
