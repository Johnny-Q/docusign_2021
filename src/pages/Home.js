import HomeImage from "../assets/homeimage.png";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: "30vw",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start"
        }}
      >
        <h2
          style={{
            textAlign: "left",
            fontSize: "2em",
            margin: 0,
            color: "#137547"
          }}
        >
          Streamlining conservation science and mapping lifecycles
        </h2>
        <p style={{ textAlign: "left", fontSize: "1.2em" }}>
          AuditPal optimizes the process of reviewing and approving conservation
          maps in accordance to Open Conservation Standards.
        </p>
      </div>
      <div style={{ width: "30vw" }}>
        <img
          src={HomeImage}
          alt="Green Person"
          style={{ width: "80%", height: "80%" }}
        />
      </div>
    </div>
  );
};

export default Home;
