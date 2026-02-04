const Spacer = ({ factor = 1 }: { factor?: number }) => {
  return <div style={{ flex: `${factor} 0 4rem` }} />;
};

export default Spacer;
