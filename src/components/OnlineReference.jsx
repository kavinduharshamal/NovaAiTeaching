import React from "react";
import { useTheme } from "@mui/material/styles";
import ProfileBar from "./ProfileBar";
import LogoBar from "./LogoBar";
import MenuBar from "./MenuBar";

const OnlineReference = () => {
  const theme = useTheme();

  // Dynamic colors based on the current theme
  const textColor =
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : theme.palette.text.primary;

  const titleColor =
    theme.palette.mode === "dark"
      ? theme.palette.text.secondary
      : theme.palette.background.paper;

  const backgroundColor = theme.palette.background.default;
  const panelBackgroundColor = theme.palette.primary.main;

  return (
    <>
      {/* Fixed ProfileBar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <ProfileBar teacherId={1} type={"student"} />
        <LogoBar />
        <MenuBar />
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          marginTop: "190px",
          padding: "16px",
          background: backgroundColor,
          minHeight: "100vh",
          color: textColor,
        }}
      >
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            background: theme.palette.background.default,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Panel with content */}
          <div
            style={{
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: panelBackgroundColor,
              boxShadow: theme.shadows[4],
              maxWidth: "800px",
              width: "100%",
              textAlign: "left",
              color: textColor,
            }}
          >
            <h2
              style={{
                fontSize: "40px",
                color: titleColor,
              }}
            >
              Search Engines for Education
            </h2>
            <ul
              style={{
                paddingLeft: "20px",

                fontSize: "15px",
                color: textColor,
              }}
            >
              {searchEngines.map((engine, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <a
                    href={engine.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: textColor,
                      textDecoration: "underline",
                    }}
                  >
                    {engine.label}
                  </a>
                </li>
              ))}
            </ul>

            <h2
              style={{
                fontSize: "40px",
                marginTop: "20px",
                color: titleColor,
              }}
            >
              Reference Materials
            </h2>
            <ul
              style={{
                paddingLeft: "20px",

                fontSize: "15px",
                color: textColor,
              }}
            >
              {referenceMaterials.map((material, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <a
                    href={material.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: textColor,
                      textDecoration: "underline",
                    }}
                  >
                    {material.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

// Array of search engines
const searchEngines = [
  { label: "Emerald Insight", href: "https://www.emerald.com/insight/" },
  { label: "Google Scholar", href: "https://scholar.google.com/" },
  { label: "Google Books", href: "https://books.google.com/" },
  { label: "Microsoft Academic", href: "https://academic.microsoft.com/" },
  { label: "ResearchGate", href: "https://www.researchgate.net/" },
  { label: "Worldatlas", href: "https://www.worldatlas.com/" },
  { label: "YouTube Education", href: "https://www.youtube.com/education" },
  {
    label: "ERIC - Education Resources Information Center",
    href: "https://eric.ed.gov/",
  },
  {
    label: "BASE - Bielefeld Academic Search Engine",
    href: "https://www.base-search.net/",
  },
  {
    label: "CORE - Central Operation of Resources for Educators",
    href: "https://core.ac.uk/",
  },
  {
    label: "DOAJ - Directory of Open Access Journals",
    href: "https://doaj.org/",
  },
];

// Array of reference materials
const referenceMaterials = [
  { label: "Encyclopedia Britannica", href: "https://www.britannica.com/" },
  { label: "Dictionary", href: "https://www.dictionary.com/" },
  { label: "Webopedia", href: "https://www.webopedia.com/" },
  { label: "Thesaurus", href: "https://www.thesaurus.com/" },
  { label: "Reference", href: "https://www.reference.com/" },
  { label: "TED - Ideas Worth Spreading", href: "https://www.ted.com/talks" },
  {
    label: "WebMD - Better Information. Better Health",
    href: "https://www.webmd.com/",
  },
  { label: "JSTOR Home", href: "https://www.jstor.org/" },
  {
    label: "Free Publicly-Accessible Databases | UCSB Library",
    href: "https://www.library.ucsb.edu/",
  },
  { label: "Sri Lankan Journals Online", href: "http://www.sljol.info/" },
  {
    label: "International Journal of Research in Commerce & Management",
    href: "https://www.ijrcm.org.in/",
  },
];

export default OnlineReference;
