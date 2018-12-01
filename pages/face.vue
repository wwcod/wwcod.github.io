<template>
  <div>
    <img ref="img"
         src="/face2.jpg"
         width="300"
         @click="detect">
    <video ref="video"
           width="480"
           height="360"></video>
    <canvas ref="canvas"
            width="100"
            height="100"></canvas>
    <button @click="cameraOn">Camera on</button>
    <button @click="cameraDetect">CameraDetection</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    faceDetector: null,
  }),
  mounted() {
    this.faceDetector = new window.FaceDetector({ fastMode: true })
  },
  methods: {
    async detect() {
      const img = this.$refs.img
      const faces = await this.faceDetector.detect(img)
      console.log(faces)
    },
    async cameraOn() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      console.log(stream)
      window.stream = stream
      const video = this.$refs.video
      video.onloadedmetadata = e => video.play()
      video.srcObject = stream
      const track = stream.getVideoTracks()[0]
      console.log(track)
      const image = new ImageCapture(track)
      console.log(image)
    },
    async cameraDetect() {
      const faces = await this.faceDetector.detect(this.$refs.video)
      if (!faces[0]) return
      const { x, y, width, height } = faces[0].boundingBox
      const margin = width / 3
      const context = this.$refs.canvas.getContext('2d')
      context.drawImage(
        this.$refs.video,
        x - margin,
        y - margin,
        width + margin * 2,
        height + margin * 2,
        0,
        0,
        100,
        100,
      )
      const base = this.$refs.canvas.toDataURL('image/jpeg', 0.5)
      console.log(base)
    },
  },
}
</script>

<style>
/* video */
canvas {
  border-radius: 100px;
	/* transform: scale(-1, 1); */
}
</style>
