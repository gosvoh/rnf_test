let cross = document.getElementById("cross");
GazeCloudAPI.StartEyeTracking();
GazeCloudAPI.OnResult = (data) => {
  if (data.state === 0) {
    cross.style.display = "block";
    cross.style.left = data.docX + "px";
    cross.style.top = data.docY + "px";
  }
};
GazeCloudAPI.OnStopGazeFlow = () => {
  cross.style.display = "none";
};
GazeCloudAPI.OnCamDenied = () => alert("Camera access denied");
GazeCloudAPI.OnError = () => alert("GazeCloud API error");
