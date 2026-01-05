export type RGB = {
  r: number;
  g: number;
  b: number;
};

const clampChannel = (value: number) => Math.max(0, Math.min(255, value));

const distance = (a: RGB, b: RGB) => {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
};

const samplePixels = (imageData: ImageData, maxSamples: number) => {
  const data = imageData.data;
  const total = imageData.width * imageData.height;
  const stride = Math.max(1, Math.floor(Math.sqrt(total / maxSamples)));
  const step = stride * 4;
  const samples: RGB[] = [];

  for (let i = 0; i < data.length; i += step) {
    const alpha = data[i + 3];
    if (alpha < 128) {
      continue;
    }
    samples.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
    });
  }

  return samples;
};

export const extractDominantColors = (
  imageData: ImageData,
  count = 5,
  maxSamples = 1400
) => {
  const samples = samplePixels(imageData, maxSamples);
  if (!samples.length) {
    return [];
  }

  const centroidCount = Math.min(count, samples.length);
  const step = Math.max(1, Math.floor(samples.length / centroidCount));
  const centroids: RGB[] = Array.from({ length: centroidCount }, (_, index) => {
    const sample = samples[(index * step) % samples.length];
    return { ...sample };
  });

  for (let iteration = 0; iteration < 8; iteration += 1) {
    const clusters = Array.from({ length: centroidCount }, () => ({
      r: 0,
      g: 0,
      b: 0,
      count: 0,
    }));

    samples.forEach((sample) => {
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      centroids.forEach((centroid, index) => {
        const nextDistance = distance(sample, centroid);
        if (nextDistance < bestDistance) {
          bestDistance = nextDistance;
          bestIndex = index;
        }
      });

      const bucket = clusters[bestIndex];
      bucket.r += sample.r;
      bucket.g += sample.g;
      bucket.b += sample.b;
      bucket.count += 1;
    });

    clusters.forEach((cluster, index) => {
      if (cluster.count === 0) {
        return;
      }

      centroids[index] = {
        r: clampChannel(cluster.r / cluster.count),
        g: clampChannel(cluster.g / cluster.count),
        b: clampChannel(cluster.b / cluster.count),
      };
    });
  }

  return centroids;
};
