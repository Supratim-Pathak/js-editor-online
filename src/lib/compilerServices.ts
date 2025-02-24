import axios from "axios";

export const getRuntimes = async () => {
  try {
    const data = await axios.get("https://emkc.org/api/v2/piston/runtimes");
    return data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error("ERROR FETCHING RUNTIME", error.message);
  }
};
export const runcode = async () => {
  // try {
  //   const response = await axios.post(
  //     "https://emkc.org/api/v2/piston/execute",
  //     {
  //       language: "python",
  //       version: "3.10.0",
  //       files: [{ content: "print('Hello, World!')" }],
  //     },
  //     {
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );

  //   console.log(response.data);
  // } catch (error:any) {
  //   // console.error(
  //   //   "Error:",
  //   //   error.response ? error.response.data : error.message
  //   // );
  // }
};
