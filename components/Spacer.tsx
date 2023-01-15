import { css } from "twin.macro";

const Spacer = ({ factor = 1 }: { factor?: number }) => {
  return (
    <div
      css={css`
        flex: ${factor} 0 4rem;
      `}
    />
  );
};

export default Spacer;
