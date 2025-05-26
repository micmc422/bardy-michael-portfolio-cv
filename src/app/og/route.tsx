import { ImageResponse } from "next/og";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Portfolio";
  const date = searchParams.get("date") || new Date().toLocaleDateString()
  const category = searchParams.get("category") || "Article"
  const readTime = searchParams.get("readTime") || "5 min read"

  // Font loading, process.cwd() is Next.js project directory
  const JosefinSansBold = await fetch('http://localhost:3000/fonts/JosefinSans-Bold.ttf')
  const JosefinSans = await fetch('http://localhost:3000/fonts/JosefinSans-Medium.ttf')
  // background-image: radial-gradient( circle 404px at 20.3% 15.9%,  rgba(0,79,255,1) 0%, rgba(0,240,255,1) 90% );
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        background: "linear-gradient(135deg,rgb(153, 0, 255) 0%,rgb(253, 122, 0) 100%)",
        padding: "60px",
        fontFamily: "Josefin Sans",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />
      <div
        style={{
          opacity:0.9,
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "100%",
          background: "linear-gradient(-135deg, #FA541C 0%,rgba(214, 40, 40, 1) 100%)",
        }}
      />
      <div
        style={{

          position: "absolute",
          bottom: "-400px",
          left: "-200px",
          width: "1000px",
          height: "1000px",
          borderRadius: "100%",
          background: "linear-gradient(90deg, #FA541C 0%, #D62828 100%)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(255,255,255,1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 519 519" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M51.6011 68.3987C88.7367 57.8277 126.915 81.2232 136.873 120.652L213.807 425.342C223.766 464.774 201.733 505.308 164.593 515.88C127.453 526.452 89.2936 503.064 79.3275 463.634L2.39282 158.944C-7.56542 119.512 14.4675 78.9775 51.6011 68.3987Z" fill="url(#paint0_linear_2770_4889)" />
              <path d="M387.942 515.814C379.736 518.51 371.07 519.511 362.468 518.756C353.866 518 345.506 515.505 337.894 511.419C330.282 507.334 323.577 501.745 318.184 494.989C312.791 488.233 308.822 480.451 306.519 472.114L202.044 108.34C197.193 91.2121 199.122 72.87 207.43 57.1304C215.737 41.3908 229.783 29.4658 246.645 23.8366C254.849 21.141 263.514 20.1406 272.116 20.8959C280.717 21.6513 289.076 24.1467 296.687 28.2311C304.298 32.3156 311.003 37.9042 316.395 44.659C321.788 51.4137 325.757 59.1941 328.062 67.5294L432.529 431.306C437.381 448.433 435.455 466.774 427.15 482.515C418.845 498.255 404.802 510.182 387.942 515.814Z" fill="url(#paint1_linear_2770_4889)" />
              <path d="M353.023 510.87C315.572 500.21 293.345 459.334 303.402 419.579L380.98 112.374C391.022 72.6153 429.516 49.0272 466.96 59.6852C504.405 70.3432 526.639 111.222 516.582 150.977L439.014 458.176C428.964 497.932 390.469 521.521 353.023 510.87Z" fill="url(#paint2_linear_2770_4889)" />
              <path d="M278.358 3.05867C313.049 14.3286 332.567 53.303 321.966 90.1213L213.024 468.461C202.423 505.279 165.715 526.002 131.049 514.748C96.3826 503.494 76.8358 464.515 87.4564 427.703L196.38 49.3535C206.989 12.5375 243.697 -8.18505 278.358 3.05867Z" fill="url(#paint3_linear_2770_4889)" />
              <defs>
                <linearGradient id="paint0_linear_2770_4889" x1="202.41" y1="465.543" x2="265.728" y2="59.685" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FA541C" />
                  <stop offset="1" stop-color="#D62828" />
                </linearGradient>
                <linearGradient id="paint1_linear_2770_4889" x1="202.41" y1="465.543" x2="265.728" y2="59.685" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FA541C" />
                  <stop offset="1" stop-color="#D62828" />
                </linearGradient>
                <linearGradient id="paint2_linear_2770_4889" x1="202.41" y1="465.543" x2="265.728" y2="59.685" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FA541C" />
                  <stop offset="1" stop-color="#D62828" />
                </linearGradient>
                <linearGradient id="paint3_linear_2770_4889" x1="202.41" y1="465.543" x2="265.728" y2="59.685" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FA541C" />
                  <stop offset="1" stop-color="#D62828" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "white",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "600" }}>Occitaweb</div>
            <div style={{ fontSize: "16px", opacity: 0.8 }}>Création de site internet</div>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          zIndex: 1,
          maxWidth: "450px",
        }}
      >
        <h1
          style={{
            fontSize: title.length > 50 ? "48px" : "64px",
            fontWeight: "900",
            color: "white",
            lineHeight: "1.1",
            margin: 0,
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            fontFamily: "Josefin Bold",
          }}
        >
          {title}
        </h1>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "white",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            <img
              src={baseURL + person.avatar}
              alt={person.name + " avatar"}
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                borderRadius: "100%",
                opacity: "0.8",
                boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.2), 0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 0 12px rgba(255, 255, 255, 0.05)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "600" }}>{person.name}</div>
            <div style={{ fontSize: "16px", opacity: 0.8 }}>{date}</div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Josefin Sans",
          data: await JosefinSans.arrayBuffer(),
          style: "normal",
          weight: 400,
        },
        {
          name: "Josefin Bold",
          data: await JosefinSansBold.arrayBuffer(),
          style: "normal",
          weight: 700,
        },
      ],
    },
  )
}

/*
export async function GET(request: Request) {
  let url = new URL(request.url);
  let title = url.searchParams.get("title") || "Portfolio";

  return new ImageResponse(
    <div style={{
      display: "flex",
      width: "100%",
      height: "100%",
      background: "rgba(20, 36, 56, 1)",
      opacity: 1,
      position: "relative",
      top: "0px",
      left: "0px",
      overflow: "hidden",
    }}>
      <div style={{
        width: "600px",
        height: "630px",
        // background: url("../images/v81_966.png"),
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        opacity: 1,
        position: "absolute",
        top: "0px",
        left: "600px",
        overflow: "hidden",
      }}>
        <div style={{ color: "#fff" }}></div>
        <div style={{ color: "#fff" }}></div>
      </div>
      <div style={{
        width: "503px",
        height: "503px",
        // background: url("../images/v84_1147.png"),
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        margin: "62px",
        opacity: 1,
        position: "absolute",
        top: "79px",
        left: "36px",
        overflow: "hidden",
      }}><span style={{
        width: "503px",
        color: "rgba(244, 244, 244, 1)",
        position: "relative",
        top: "0px",
        left: "0px",
        fontFamily: "Kumbh Sans",
        fontWeight: "Bold",
        fontSize: "64px",
        opacity: 1,
        textAlign: "center",
      }}>Get On-Brand Design, Fast, Without The Hassle</span>
        <div style={{ color: "#fff" }}></div>
      </div>
    </div>,
    {
      width: 1280,
      height: 720,
    },
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "8rem",
        background: "#151515",
        backgroundImage: "linear-gradient( 109.6deg,  rgba(163,213,255,1) 11.3%, rgba(4,137,137,1) 86.7% );"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "4rem",
          fontFamily: "Inter",
          fontStyle: "normal",
          color: "white",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "5rem",
            lineHeight: "5rem",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-wrap",
            textWrap: "balance",
            lineClamp: 2,
          }}
        >
          {title}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5rem",
          }}
        >
          <img
            src={baseURL + person.avatar}
            alt={person.name + " avatar"}
            style={{
              width: "12rem",
              height: "12rem",
              objectFit: "cover",
              borderRadius: "100%",
              opacity: "0.8",
              boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.2), 0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 0 12px rgba(255, 255, 255, 0.05)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "4.5rem",
                lineHeight: "4.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
              }}
            >
              {person.name}
            </span>
            <span
              style={{
                fontSize: "2.5rem",
                lineHeight: "2.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
                opacity: "0.6",
              }}
            >
              {person.role}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1280,
      height: 720,
    },
  );
}
*/