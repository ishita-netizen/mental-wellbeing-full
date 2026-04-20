export async function submitEntry(data) {
  await fetch("http://localhost:5000/entry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
