import styles from "./spinner.module.css";
import png from "./sq_spin.png";

const defaultSize = 40;

export function Spinner(props: { size?: number }) {
  return (
    <div
      className={styles.spinner}
      style={{
        width: `${props.size ?? defaultSize}px`,
        height: `${props.size ?? defaultSize}px`,
      }}
    >
      <img src={png} alt="Loading..." />
    </div>
  );
}
