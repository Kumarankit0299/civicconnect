// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//   ],
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     fontSize: {
//       "heading1-bold": [
//         "36px",
//         {
//           lineHeight: "140%",
//           fontWeight: "700",
//         },
//       ],
//       "heading1-semibold": [
//         "36px",
//         {
//           lineHeight: "140%",
//           fontWeight: "600",
//         },
//       ],
//       "heading2-bold": [
//         "30px",
//         {
//           lineHeight: "140%",
//           fontWeight: "700",
//         },
//       ],
//       "heading2-semibold": [
//         "30px",
//         {
//           lineHeight: "140%",
//           fontWeight: "600",
//         },
//       ],
//       "heading3-bold": [
//         "24px",
//         {
//           lineHeight: "140%",
//           fontWeight: "700",
//         },
//       ],
//       "heading4-medium": [
//         "20px",
//         {
//           lineHeight: "140%",
//           fontWeight: "500",
//         },
//       ],
//       "body-bold": [
//         "18px",
//         {
//           lineHeight: "140%",
//           fontWeight: "700",
//         },
//       ],
//       "body-semibold": [
//         "18px",
//         {
//           lineHeight: "140%",
//           fontWeight: "600",
//         },
//       ],
//       "body-medium": [
//         "18px",
//         {
//           lineHeight: "140%",
//           fontWeight: "500",
//         },
//       ],
//       "body-normal": [
//         "18px",
//         {
//           lineHeight: "140%",
//           fontWeight: "400",
//         },
//       ],
//       "body1-bold": [
//         "18px",
//         {
//           lineHeight: "140%",
//           fontWeight: "700",
//         },
//       ],
//       "base-regular": [
//         "16px",
//         {
//           lineHeight: "140%",
//           fontWeight: "400",
//         },
//       ],
//       "base-medium": [
//         "16px",
//         {
//           lineHeight: "140%",
//           fontWeight: "500",
//         },
//       ],
//       "base-semibold": [
//         "16px",
//         {
//           lineHeight: "140%",
//           fontWeight: "600",
//         },
//       ],
//       "base1-semibold": [
//         "16px",
//         {
//           lineHeight: "140%",
//           fontWeight: "600",
//         },
//       ],
//       "small-regular": [
//         "14px",
//         {
//           lineHeight: "140%",
//           fontWeight: "400",
//         },
//       ],
//       "small-medium": [
//         "14px",
//         {
//           lineHeight: "140%",
//           fontWeight: "500",
//         },
//       ],
//       "small-semibold": [
//         "14px",
//         {
//           lineHeight: "140%",
//           fontWeight: "600",
//         },
//       ],
//       "subtle-medium": [
//         "12px",
//         {
//           lineHeight: "16px",
//           fontWeight: "500",
//         },
//       ],
//       "subtle-semibold": [
//         "12px",
//         {
//           lineHeight: "16px",
//           fontWeight: "600",
//         },
//       ],
//       "tiny-medium": [
//         "10px",
//         {
//           lineHeight: "140%",
//           fontWeight: "500",
//         },
//       ],
//       "x-small-semibold": [
//         "7px",
//         {
//           lineHeight: "9.318px",
//           fontWeight: "600",
//         },
//       ],
//     },
//     extend: {
//       colors: {
//         "primary-500": "#877EFF",
//         "secondary-500": "#FFB620",
//         blue: "#0095F6",
//         "logout-btn": "#FF5A5A",
//         "navbar-menu": "rgba(16, 16, 18, 0.6)",
//         "dark-1": "#000000",
//         "dark-2": "#121417",
//         "dark-3": "#101012",
//         "dark-4": "#1F1F22",
//         "light-1": "#FFFFFF",
//         "light-2": "#EFEFEF",
//         "light-3": "#7878A3",
//         "light-4": "#5C5C7B",
//         "gray-1": "#697C89",
//         glassmorphism: "rgba(16, 16, 18, 0.60)",
//       },
//       boxShadow: {
//         "count-badge": "0px 0px 6px 2px rgba(219, 188, 159, 0.30)",
//         "groups-sidebar": "-30px 0px 60px 0px rgba(28, 28, 31, 0.50)",
//       },
//       screens: {
//         xs: "400px",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: 0 },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: 0 },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
// };


import { withUt } from 'uploadthing/tw'
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      "heading1-bold": [
        "36px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "heading1-semibold": [
        "36px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "heading2-bold": [
        "30px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "heading2-semibold": [
        "30px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "heading3-bold": [
        "24px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "heading4-medium": [
        "20px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "body-bold": [
        "18px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "body-semibold": [
        "18px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "body-medium": [
        "18px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "body-normal": [
        "18px",
        {
          lineHeight: "140%",
          fontWeight: "400",
        },
      ],
      "body1-bold": [
        "18px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "base-regular": [
        "16px",
        {
          lineHeight: "140%",
          fontWeight: "400",
        },
      ],
      "base-medium": [
        "16px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "base-semibold": [
        "16px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "base1-semibold": [
        "16px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "small-regular": [
        "14px",
        {
          lineHeight: "140%",
          fontWeight: "400",
        },
      ],
      "small-medium": [
        "14px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "small-semibold": [
        "14px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "subtle-medium": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: "500",
        },
      ],
      "subtle-semibold": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: "600",
        },
      ],
      "tiny-medium": [
        "10px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "x-small-semibold": [
        "7px",
        {
          lineHeight: "9.318px",
          fontWeight: "600",
        },
      ],
    },
    extend: {
      colors: {
        "primary-500": "#877EFF",
        "secondary-500": "#FFB620",
        blue: "#0095F6",
        "logout-btn": "#FF5A5A",
        "navbar-menu": "rgba(16, 16, 18, 0.6)",
        "dark-1": "#000000",
        "dark-2": "#121417",
        "dark-3": "#101012",
        "dark-4": "#1F1F22",
        "light-1": "#FFFFFF",
        "light-2": "#EFEFEF",
        "light-3": "#7878A3",
        "light-4": "#5C5C7B",
        "gray-1": "#697C89",
        glassmorphism: "rgba(16, 16, 18, 0.60)",
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },
        'dark-tremor': {
          brand: {
            faint: '#0B1229',
            muted: colors.blue[950],
            subtle: colors.blue[800],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[400],
            inverted: colors.blue[950],
          },
          background: {
            muted: '#131A2B',
            subtle: colors.gray[800],
            DEFAULT: colors.gray[900],
            emphasis: colors.gray[300],
          },
          border: {
            DEFAULT: colors.gray[700],
          },
          ring: {
            DEFAULT: colors.gray[800],
          },
          content: {
            subtle: colors.gray[600],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[200],
            strong: colors.gray[50],
            inverted: colors.gray[950],
          },
        },
        boxShadow: {
          // light
          'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          'tremor-card':
            '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          'tremor-dropdown':
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          // dark
          'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          'dark-tremor-card':
            '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          'dark-tremor-dropdown':
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
        borderRadius: {
          'tremor-small': '0.375rem',
          'tremor-default': '0.5rem',
          'tremor-full': '9999px',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        "count-badge": "0px 0px 6px 2px rgba(219, 188, 159, 0.30)",
        "groups-sidebar": "-30px 0px 60px 0px rgba(28, 28, 31, 0.50)",
      },
      screens: {
        xs: "400px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: '0' },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: '0.375rem' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};





