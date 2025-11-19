interface AlphabetData {
  [key: string]: {
    paths: Array<{ points: [number, number][] }>;
    instructions: string;
  };
}

export const ALPHABET_DATA: AlphabetData = {
  "1": {
    paths: [
      {
        points: [
          [220, 100],
          [250, 70],
          [250, 350],
        ],
      },
      {
        points: [
          [180, 350],
          [320, 350],
        ],
      },
    ],
    instructions:
      "Mulai dari atas, tarik ke bawah, lalu tambahkan garis dasar.",
  },
  "2": {
    paths: [
      {
        points: [
          [180, 120],
          [220, 70],
          [280, 70],
          [320, 120],
          [180, 280],
          [180, 350],
          [320, 350],
        ],
      },
    ],
    instructions:
      "Mulai dari kiri atas, lengkung ke kanan, lalu diagonal ke bawah dan menyeberang.",
  },
  "3": {
    paths: [
      {
        points: [
          [180, 100],
          [250, 50],
          [300, 100],
          [250, 200],
        ],
      }, // Top curve
      {
        points: [
          [250, 200],
          [300, 250],
          [300, 300],
          [250, 350],
          [180, 300],
        ],
      }, // Bottom curve
    ],
    instructions: "Buat dua lengkungan di sisi kanan!",
  },
  "4": {
    paths: [
      {
        points: [
          [280, 50],
          [180, 230],
          [320, 230],
        ],
      }, // Vertical down and horizontal
      {
        points: [
          [280, 50],
          [280, 350],
        ],
      }, // Right vertical line
    ],
    instructions:
      "Tarik ke bawah, menyeberang, lalu selesaikan dengan garis ke bawah.",
  },
  "5": {
    paths: [
      {
        points: [
          [300, 50],
          [180, 50],
          [180, 180],
          [250, 180],
          [300, 230],
          [300, 300],
          [250, 350],
          [180, 300],
        ],
      },
    ],
    instructions: "Menyeberang, ke bawah, lengkung ke kanan dan bawah.",
  },
  "6": {
    paths: [
      {
        points: [
          [280, 100],
          [220, 50],
          [180, 120],
          [180, 280],
          [220, 350],
          [280, 350],
          [320, 300],
          [320, 250],
          [280, 200],
          [200, 200],
        ],
      },
    ],
    instructions:
      "Mulai dari atas, lengkung ke bawah dan putar membuat lingkaran di bawah.",
  },
  "7": {
    paths: [
      {
        points: [
          [180, 50],
          [320, 50],
          [220, 350],
        ],
      },
    ],
    instructions: "Tarik menyeberang di atas, lalu diagonal ke bawah.",
  },
  "8": {
    paths: [
      {
        points: [
          [250, 200],
          [200, 150],
          [200, 100],
          [250, 50],
          [300, 100],
          [300, 150],
          [250, 200],
          [200, 250],
          [200, 300],
          [250, 350],
          [300, 300],
          [300, 250],
          [250, 200],
        ],
      },
    ],
    instructions:
      "Mulai di tengah, putar ke atas, lalu putar ke bawah seperti ular.",
  },
  "9": {
    paths: [
      {
        points: [
          [320, 140],
          [320, 100],
          [280, 60],
          [220, 60],
          [180, 100],
          [180, 140],
          [220, 180],
          [280, 180],
          [320, 140],
        ],
      }, // Top circle (clockwise from right)
      {
        points: [
          [320, 140],
          [320, 200],
          [300, 260],
          [270, 310],
          [230, 350],
          [180, 350],
        ],
      }, // Tail curving down and left
    ],
    instructions:
      "Gambar lingkaran di atas, lalu lengkung ke bawah seperti ekor.",
  },

  // Letters A-C
  A: {
    paths: [
      {
        points: [
          [150, 350],
          [250, 50],
          [350, 350],
        ],
      }, // The inverted V
      {
        points: [
          [195, 200],
          [305, 200],
        ],
      }, // The crossbar
    ],
    instructions:
      "Mulai dari kiri bawah, naik ke atas, lalu turun. Lalu silang di tengah.",
  },
  B: {
    paths: [
      {
        points: [
          [150, 50],
          [150, 350],
        ],
      }, // Vertical line
      {
        points: [
          [150, 50],
          [250, 50],
          [300, 100],
          [250, 175],
          [150, 175],
        ],
      }, // Top loop
      {
        points: [
          [150, 175],
          [280, 175],
          [320, 250],
          [250, 350],
          [150, 350],
        ],
      }, // Bottom loop
    ],
    instructions: "Gambar garis vertikal dulu. Lalu dua lengkungan!",
  },
  C: {
    paths: [
      {
        points: [
          [320, 100],
          [270, 50],
          [220, 50],
          [170, 100],
          [170, 300],
          [220, 350],
          [270, 350],
          [320, 300],
        ],
      },
    ],
    instructions: "Mulai dari kanan atas dan lengkung ke kiri.",
  },
};
