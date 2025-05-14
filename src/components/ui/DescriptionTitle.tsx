const DescriptionTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div style={{ marginBottom: "15px" }}>
      <h2>{title}</h2>
      <span style={{ color: "#7d7d86" }}>{description}</span>
    </div>
  );
};

export default DescriptionTitle;
