import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Header from "./Header";
const History = () => {
  const [userReports, setUserReports] = useState({});
  const usertoken = localStorage.getItem("token");
  const generatePdf = (report) => {
    const pdf = new jsPDF();
    let pageNumber = 1;
    const {
      companyName,
      companyOwner,
      companyDescription,
      companyWebsite,
      sector,
      reportingYear,
      consolidation,
      plantAddresses,
      productFuelUsage,
      productEmissionFactors,
      productNames,
      officeEmissionFactors,
      officeNames,
      managerNames,
      officeElectricityUsage,
      officeElectricityFactor,
      domesticOutwardData,
      exportOutwardData,
      headOfficerNames,
      otherSector,
    } = report;
    // console.log(productEmissionFactors);

    // Constants
    const CO2_factor = 1;
    const N2O_factor = 298;
    const CH4_factor = 25;

    // Calculate total emissions for each product
    const totalEmissionsPerProduct = [];

    // Calculate total emissions for all products
    let totalEmissions = 0;

    // Iterate through each product in category 1
    productFuelUsage.forEach((plant, plantIndex) => {
      plant.forEach((fuelUsage, productIndex) => {
        if (fuelUsage !== "0") {
          // Check if product exists
          // Fetch emission factors for the product
          const ef_CO2 =
            productEmissionFactors[plantIndex][productIndex]["CO2"];
          const ef_CH4 =
            productEmissionFactors[plantIndex][productIndex]["CH4"];
          const ef_N2O =
            productEmissionFactors[plantIndex][productIndex]["N2O"];

          // Calculate total emissions for the product
          let totalEmissionsProduct = 0;
          for (
            let monthIndex = 0;
            monthIndex < fuelUsage.length;
            monthIndex++
          ) {
            const emissions =
              fuelUsage[monthIndex] *
              (ef_CO2 * CO2_factor + ef_CH4 * CH4_factor + ef_N2O * N2O_factor);
            totalEmissionsProduct += emissions;
          }

          // Store total emissions with product name
          const productName = productNames[plantIndex][productIndex];
          totalEmissionsPerProduct.push({ productName, totalEmissionsProduct });

          // Add total emissions for the product to the total emissions for all products
          totalEmissions += totalEmissionsProduct;
        }
      });
    });

    // Display total emissions for each product
    totalEmissionsPerProduct.forEach((product) => {
      console.log(
        `Total emissions for ${product.productName}: ${product.totalEmissionsProduct}`
      );
    });

    // Display total emissions for all products
    console.log(`Total emissions for all products: ${totalEmissions}`);

    // Calculate total emissions for each office
    const totalEmissionsPerOffice = [];

    // Calculate total emissions for all offices
    let totalEmissions1 = 0;

    // Iterate through each office in category 2
    officeElectricityUsage.forEach((plant, plantIndex) => {
      plant.forEach((office, officeIndex) => {
        // Fetch emission factors for the office
        const ef_CO2 = officeEmissionFactors[plantIndex][officeIndex]["CO2"];
        const ef_CH4 = officeEmissionFactors[plantIndex][officeIndex]["CH4"];
        const ef_N2O = officeEmissionFactors[plantIndex][officeIndex]["N2O"];

        // Calculate total emissions for the office
        let totalEmissionsOffice = 0;
        for (let monthIndex = 0; monthIndex < office.length; monthIndex++) {
          const emissions =
            office[monthIndex] *
            officeElectricityFactor[plantIndex][officeIndex][monthIndex] *
            (ef_CO2 * CO2_factor + ef_CH4 * CH4_factor + ef_N2O * N2O_factor);
          totalEmissionsOffice += emissions;
        }

        // Store total emissions with office name
        const officeName = officeNames[plantIndex][officeIndex];
        totalEmissionsPerOffice.push({ officeName, totalEmissionsOffice });

        // Add total emissions for the office to the total emissions for all offices
        totalEmissions1 += totalEmissionsOffice;
      });
    });

    // Display total emissions for each office
    totalEmissionsPerOffice.forEach((office) => {
      console.log(
        `Total emissions for ${office.officeName}: ${office.totalEmissionsOffice}`
      );
    });

    // Display total emissions for all offices
    console.log(`Total emissions for all offices: ${totalEmissions1}`);

    function calculateEmissions(transaction) {
      const ef_CO2 = parseFloat(transaction.emissionFactorCO2);
      const ef_CH4 = parseFloat(transaction.emissionFactorCH4);
      const ef_N2O = parseFloat(transaction.emissionFactorN2O);
      const emissions =
        transaction.distanceCovered *
        (ef_CO2 * CO2_factor + ef_CH4 * CH4_factor + ef_N2O * N2O_factor);
      return emissions;
    }

    // Calculate total emissions for domestic outward transactions
    let totalDomesticEmissions = 0;
    domesticOutwardData.forEach((plant) => {
      plant.forEach((transaction) => {
        totalDomesticEmissions += calculateEmissions(transaction);
      });
    });

    // Calculate total emissions for export outward transactions
    let totalExportEmissions = 0;
    exportOutwardData.forEach((plant) => {
      plant.forEach((transaction) => {
        totalExportEmissions += calculateEmissions(transaction);
      });
    });

    // Display total emissions for domestic and export outward transactions
    console.log(
      "Total emissions for domestic outward transactions:",
      totalDomesticEmissions
    );
    console.log(
      "Total emissions for export outward transactions:",
      totalExportEmissions
    );

    const titleStyle = {
      fontSize: 60,
      font: "helvetica",
      fontStyle: "bold",
      textColor: [0, 128, 0],
    };

    const subtitleStyle = {
      fontSize: 30,
      font: "helvetica",
      textColor: [0, 0, 0],
    };

    const normalTextStyle = {
      fontSize: 20,
      font: "helvetica",
      textColor: [0, 0, 0],
    };

    pdf.setFontSize(titleStyle.fontSize);
    pdf.setTextColor.apply(this, titleStyle.textColor);
    pdf.setFont(titleStyle.font, titleStyle.fontStyle);

    pdf.text(100, 65, companyName, { align: "center" });

    pdf.setFontSize(subtitleStyle.fontSize);
    pdf.setTextColor.apply(this, subtitleStyle.textColor);
    pdf.setFont(subtitleStyle.font);

    pdf.text(105, 125, "GREENHOUSE GAS EMISSIONS REPORT", { align: "center" });

    pdf.setFontSize(normalTextStyle.fontSize);
    pdf.setTextColor.apply(this, normalTextStyle.textColor);
    pdf.setFont(normalTextStyle.font);

    pdf.text(
      45,
      180,
      `Inventory Scope: ${sector === "other" ? otherSector : sector}`
    );

    pdf.text(45, 200, `Reporting Period: ${reportingYear}`);

    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, 100, 280, { align: "center" });
    pageNumber++;

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(30);
    pdf.text(50, 30, "CONTENTS");
    pdf.setFontSize(10);
    pdf.text(20, 40, "CHAPTER 1: GENERAL DETAILS, PURPOSE AND POLICY");
    pdf.text(20, 45, "1.1 Introduction");
    pdf.text(20, 50, "1.2 Purpose ");
    pdf.text(20, 55, `1.3 Description of ${companyName}`);
    pdf.text(
      30,
      60,
      "1.3.1 GHG and Sustainability Policies, Strategies and Programmes"
    );
    pdf.text(20, 65, "1.4 Persons Responsible ");
    pdf.text(
      30,
      70,
      "1.4.1 Team Training for the Preparation of this Emissions Inventory and GHG Report "
    );
    pdf.text(20, 75, "1.5 Audience and Dissemination Policy ");
    pdf.text(20, 80, "1.6 Reporting Period and Frequency of Reporting ");
    pdf.text(20, 85, "1.7 Reporting Standards, Approach and Verification ");
    pdf.text(30, 90, "1.7.1 Compliance with ISO 14064-1:2018 ");
    pdf.text(30, 95, "1.7.2 Audit of GHG Inventory ");
    pdf.text(20, 105, "CHAPTER 2: ORGANISATIONAL BOUNDARIES");
    pdf.text(20, 110, "2.1 Consolidation Approach");
    pdf.text(20, 115, "2.2 Organisational Chart");

    pdf.text(20, 125, "CHAPTER 3: REPORTING BOUNDARIES ");
    pdf.text(20, 130, "3.1 Emissions Categories and Classification");
    pdf.text(20, 135, "3.2 Significance and Materiality");

    pdf.text(20, 145, "CHAPTER 4: QUANTIFIED GHG INVENTORY OF EMISSIONS");
    pdf.text(20, 150, "4.1 Consolidated Statement of Greenhouse Gas Emissions");
    pdf.text(
      20,
      155,
      "4.2 Methodologies for the Collection and Quantification of Data"
    );
    pdf.text(30, 160, "4.2.1 Approach to Emission Factors");
    pdf.text(30, 165, "4.2.2 Changes in Methodologies on prior year/base year");
    pdf.text(30, 170, "4.2.3 GWP Calculation and Source");

    //CHAPTER 1
    const margin = 20;
    function addContentWithWrap(x, y, content, maxWidth) {
      pdf.text(x, y, pdf.splitTextToSize(content, maxWidth - margin * 2));
    }

    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, 100, 280, { align: "center" });
    pageNumber++;

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(18);

    addContentWithWrap(
      20,
      20,
      `CHAPTER 1: GENERAL DETAILS, PURPOSE AND POLICY`,
      250
    );
    pdf.setFontSize(13);
    pdf.text(20, 30, "1.1 Introduction");
    pdf.setFontSize(10);

    addContentWithWrap(
      20,
      40,
      `The following document provides the ${companyName} Group of companies’ full global greenhouse gas (GHG) emissions inventory for the ${reportingYear} calendar year.`,
      230
    );
    addContentWithWrap(
      20,
      50,
      `${companyName}’s reporting processes and emissions classifications are consistent with international
protocols and standards. This report has been prepared in accordance with the International
Standards Organisation standard ISO 14064-1:2018. The information provided follows the
requirements outlined in Part 9.3.1 and (where applicable) 9.3.2 of the standard.`,
      230
    );

    pdf.setFontSize(13);
    pdf.text(20, 80, "1.2 Purpose");
    pdf.setFontSize(10);

    addContentWithWrap(
      20,
      90,
      `${companyName}’s intent here is to demonstrate best practice with respect to consistency, comparability, and completeness in the accounting of greenhouse gas emissions.`,
      230
    );
    addContentWithWrap(
      20,
      100,
      `This report:
\u2022 Relates to emissions for the ${companyName} Group of companies.
\u2022 Has been prepared in accordance with the requirements of the ISO 14064-1:2018 standard.
\u2022 Endeavours to use primary data wherever possible, especially surrounding all major emissions sources. Where primary data is not available, a consistent and conservative approach to calculation will be applied.
\u2022 Reflects our commitment to better understanding and ultimately improving our operational performance with respect to emissions.
\u2022 Excludes specific targets.`,
      230
    );

    pdf.setFontSize(13);
    pdf.text(20, 150, `1.3 Description of ${companyName}`);
    pdf.setFontSize(10);
    addContentWithWrap(20, 160, `${companyDescription}`, 230);
    pdf.setFontSize(12);
    pdf.text(
      20,
      200,
      "1.3.1 GHG and Sustainability Policies, Strategies and Programmes"
    );
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      210,
      `Our vision for a 100-year company is not about reaching an end-point. It’s a mind-set that every day
and every deed is about growing a strong, iconic, enduring business. This means leaving the place
better than we found it and doing all we can to safeguard the future of our people, our
communities and our planet.

Climate change remains a defining issue for businesses and governments everywhere. For
${companyName}, it begins with accepting that our business is based on an activity that generates carbon
emissions and therefore taking responsibility to reduce those emissions over time while
maintaining our competitiveness and ability to deliver quality services as our customers expect.
${companyName}’s commitment to sustainability, safety, health and the environment has been, and
continues to be, a fundamental element of our operating practices and success to date. For more
on ${companyName} sustainability please visit:

               ${companyWebsite}
`,
      230
    );

    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, 100, 280, { align: "center" });
    pageNumber++;

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(13);
    pdf.text(20, 20, "1.4 Persons Responsible ");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      30,
      `
The provided GHG Inventory and Report has been prepared by the ${companyOwner}
  

Support and preparation of the inventory:

${plantAddresses
  .map(
    (plantAddress, index) =>
      `\u2022 ${plantAddress} -> ${headOfficerNames[index]}
  `
  )
  .join("\n")}

  
Assisting with background data and supporting information:
`,
      230
    );

    let Office = [];
    officeElectricityUsage.forEach((plant, plantIndex) => {
      plant.forEach((office, officeIndex) => {
        const officeName = officeNames[plantIndex][officeIndex];
        const managerName = managerNames[plantIndex][officeIndex];
        Office.push({ officeName, managerName });
      });
    });

    let yPos1 = 90;
    Office.forEach((office) => {
      pdf.text(`   ${office.officeName}: ${office.managerName}`, 20, yPos1);
      yPos1 += 10;
    });

    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, 100, 280, { align: "center" });
    pageNumber++;

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(12);
    pdf.text(
      20,
      20,
      "1.4.1 Team Training for the Preparation of this Emissions Inventory and GHG Report"
    );
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      30,
      `Members of the core inventory preparation team are aware of all principles and requirements
within ISO 14064-1:2018 standard.

The inventory preparation team provided regional contributors with a detailed data input template
and instructions on collection of data in line with the standard.

`,
      230
    );

    pdf.setFontSize(13);
    pdf.text(20, 80, "1.5 Audience and Dissemination Policy");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      90,
      `This report is intended for all ${companyName} stakeholders interested in its greenhouse gas emissions
inventory and the associated reporting structure, notation and explanations. It is provided publicly
following appropriate third party verification.
`,
      230
    );
    pdf.setFontSize(13);
    pdf.text(20, 120, "1.6 Reporting Period and Frequency of Reporting");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      130,
      `This GHG report covers the year ${reportingYear} GHG reports are produced annually.
`,
      230
    );

    pdf.setFontSize(15);
    pdf.text(20, 160, "1.7 Reporting Standards, Approach and Verification");
    pdf.setFontSize(13);
    pdf.text(20, 170, "1.7.1 Compliance with ISO 14064-1:2018");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      180,
      `The GHG report for the year ${reportingYear} has been prepared in accordance with ISO
14064-1:2018. A reporting index has been provided in appendix 1.
`,
      230
    );

    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, 100, 280, { align: "center" });
    pageNumber++;

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(15);
    pdf.text(20, 20, "CHAPTER 2: ORGANISATIONAL BOUNDARIES");
    pdf.setFontSize(13);
    pdf.text(20, 30, "2.1 Consolidation Approach");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      40,
      `${companyName} utilises the ‘${consolidation}’ consolidation method for our emissions inventory.
This approach considers all emissions that ${companyName} has control over.

The most significant application of this approach is the inclusion of emissions from our owner
drivers, agents, rail providers, shipping lines and airlines that support our service offering to
customers.

Franchises, although related to the ${companyName} Group, are not considered under its control and
have not been included in the emissions summary.`,
      230
    );

    pdf.setFontSize(13);
    pdf.text(20, 100, "2.2 Organisational Chart");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      110,
      `The below organisational chart depicts the operating nature of the ${companyName} Group as is relevant
to the emissions summary.`,
      230
    );
    addContentWithWrap(
      20,
      130,
      `  ${companyName} has ${plantAddresses.length} Plants

${plantAddresses
  .map(
    (plantAddress, index) =>
      `${index + 1}. ${plantAddress}
`
  )
  .join("\n")}
`,
      230
    );

    let plants = [];
    officeElectricityUsage.forEach((plant, plantIndex) => {
      plant.forEach((office, officeIndex) => {
        const officeName = officeNames[plantIndex][officeIndex];

        plants.push({ officeName, plantIndex });
      });
    });

    let yPos2 = 160;
    plants.forEach((office) => {
      pdf.text(
        ` ${plantAddresses[office.plantIndex]} has ${office.officeName} `,
        20,
        yPos2
      );
      yPos2 += 10;
    });

    pdf.setFontSize(15);
    pdf.text(20, 200, "CHAPTER 3: REPORTING BOUNDARIES");
    pdf.setFontSize(13);
    pdf.text(20, 210, "3.1 Emissions Categories and Classification");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      220,
      `Greenhouse gas emissions sources have been identified and grouped in accordance with the ISO
14064-1:2018 standard. This methodology lists three categories of emissions.

\u2022 Category 1: Direct GHG emissions and removals

\u2022 Category 2: Indirect GHG emissions from imported energy

\u2022 Category 3: Indirect GHG emissions from transportation

`,
      230
    );
    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, 100, 280, { align: "center" });
    pageNumber++;

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });

    pdf.setFontSize(13);
    pdf.text(20, 20, "3.2 Significance and Materiality");
    pdf.setFontSize(10);

    addContentWithWrap(
      20,
      30,
      `Factors for consideration in assessing significance and materiality include:

\u2022 Size of the emissions

\u2022 ${companyName}’s influence on the emission source

\u2022 Difficulty in obtaining data

\u2022 Poor validity in available estimation approaches

Whilst all of the above would be considered in materiality assessments, the criteria that would
mandate disclosure of emissions sources as significant is:

a) Where there is a single source with estimated emissions likely to be at least 1% of
${companyName}’s total emissions. In this case, that emissions source must be included.

b) Where the total of ‘insignificant’ sources has estimated emissions likely to be at least 5% of
${companyName}’s total emissions. In this case, enough of the ‘insignificant’ emissions must be
included until the estimate of excluded emissions is below 5%.
`,
      230
    );

    pdf.setFontSize(15);
    pdf.text(20, 120, "CHAPTER 4: QUANTIFIED GHG INVENTORY OF EMISSIONS");
    pdf.setFontSize(13);
    pdf.text(20, 130, "4.1 Consolidated Statement of Greenhouse Gas Emissions");
    pdf.setFontSize(10);

    let yPos = 135;

    pdf.text("1. Category 1: Direct GHG emissions and removals", 20, yPos);
    yPos += 5;
    totalEmissionsPerProduct.forEach((product) => {
      pdf.text(
        `   co2 emissions for ${product.productName}: ${(
          product.totalEmissionsProduct / 1000
        ).toFixed(3)}tco2`,
        20,
        yPos
      );
      yPos += 5;
    });

    pdf.text(
      `Total co2 emissions of category1: ${(totalEmissions / 1000).toFixed(
        3
      )}tco2`,
      20,
      yPos
    );
    yPos += 10;
    pdf.text(
      "2. Category 2: Indirect GHG emissions from imported energy",
      20,
      yPos
    );
    yPos += 5;
    totalEmissionsPerOffice.forEach((office) => {
      pdf.text(
        `   co2 emissions for ${office.officeName}: ${(
          office.totalEmissionsOffice / 1000
        ).toFixed(3)}tco2`,
        20,
        yPos
      );
      yPos += 5;
    });
    pdf.text(
      `Total CO2 emissions of Category 2: ${(totalEmissions1 / 1000).toFixed(
        3
      )} tCO2`,
      20,
      yPos
    );

    yPos += 10;
    pdf.text(
      "3. Category 3: Indirect GHG emissions from transportation",
      20,
      yPos
    );
    yPos += 5;
    pdf.text(
      ` Total co2 emissions for all domestic outwards: ${(
        totalDomesticEmissions / 1000
      ).toFixed(3)} tCO2`,
      20,
      yPos
    );
    yPos += 5;
    pdf.text(
      ` Total co2 emissions for all export outwards: ${(
        totalExportEmissions / 1000
      ).toFixed(3)} tCO2`,
      20,
      yPos
    );
    yPos += 5;
    pdf.text(
      `Total co2 emissions of category3: ${(
        totalDomesticEmissions / 1000 +
        totalExportEmissions / 1000
      ).toFixed(3)} tCO2`,
      20,
      yPos
    );
    yPos += 5;
    yPos += 5;
    pdf.text(
      `Total co2 emissions of company: ${(
        totalDomesticEmissions / 1000 +
        totalExportEmissions / 1000 +
        totalEmissions / 1000 +
        totalEmissions1 / 1000
      ).toFixed(3)} tCO2`,
      20,
      yPos
    );

    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, 100, 280, { align: "center" });
    pageNumber++;

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(12);
    // Notes to Consolidated Statement of Greenhouse Gas Emissions
    pdf.text(
      20,
      20,
      "Notes to Consolidated Statement of Greenhouse Gas Emissions :"
    );
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      25,
      `
1. Direct and indirect emissions have been prepared in accordance with the recommendations of Annex B. Gas types CO2, CH4 and N2O have been included as those relevant to direct emissions from mobile combustion. HFC has been included although zero due to our holding of this gas type. All other GHGs
without values have been excluded.

2. In order to align to Annex B, category 1 emissions here summarise several subcategories of emissions
sources relevant to our operations.

3. This includes electricity transmission and distribution losses.

4. This document does not provide any recommendations or requirements for removal.

5. Emissions liabilities are denoted here but not included in the emissions total. For further details see
section 4.2.
`,
      228
    );
    pdf.setFontSize(12);
    pdf.text(
      20,
      110,
      "4.2 Methodologies for the Collection and Quantification of Data"
    );
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      115,
      `
As a large global enterprise, the collection of emissions data spans a broad range of localities and
consequently, service providers and data sources. As a result, source data varies widely in both
format and degree of detail.

The emissions summary represents a best attempt to consolidate and standardise emissions data
and provide a detailed explanation of working and estimation in line with the ISO 14064-1:2018
standard.

Due to their access and understanding of global reporting and data sources, ${companyName}’s finance
team have led the data collection efforts to date.
      
`,
      228
    );
    pdf.setFontSize(12);
    pdf.text(20, 190, "4.2.1 Approach to Emission Factors");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      195,
      `
Where possible, emission factors are specific to each reporting region. Where specific regional
emission factors are not available or applicable, we have taken the most relevant as suggested by
the website https://emissionfactors.com/.
      
`,
      228
    );
    pdf.setFontSize(12);
    pdf.text(20, 230, "4.2.2 Changes in Methodologies on prior year/base year");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      235,
      `
This report, representing the ${reportingYear} calendar year is the GHG report published by ${companyName}, it
provides the base year for future assessments.
`,
      228
    );

    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, 100, 280, { align: "center" });
    pageNumber++;

    pdf.addPage();
    pdf.setFontSize(10);
    pdf.text(190, 10, companyName, { align: "right" });
    pdf.setFontSize(12);
    pdf.text(20, 20, "4.2.3 GWP Calculation and Source ");
    pdf.setFontSize(10);
    addContentWithWrap(
      20,
      25,
      `
Quantities of GHG emissions are expressed as tonnes of CO2-e (Carbon Dioxide Equivalents) using
the global warming potentials (GWP) from the IPCC Fifth Assessment Report (AR5). The time
horizon is 100 years.

Direct emissions sources (Category 1) are expressed as both CO2-e and their detailed GHG
breakdown, including the GWP (Global Warming Potential) value. The most notable GHGs include:

                GHG                             Chemical Formula              GWP
          Carbon dioxide                            CO2                            1
          Methane                                        CH4                            25
          Nitrous oxide                                N2O                           298
`,
      228
    );

    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, 100, 280, { align: "center" });
    pageNumber++;

    const fileName = `ghg_report_${companyName.replace(/\s+/g, "_")}.pdf`;
    pdf.save(fileName);
  };

  useEffect(() => {
    const fetchReports = async () => {
      const reports = {};

      try {
        const response = await axios.get(
          `http://localhost:8080/reports/${usertoken}`
        );
        reports[usertoken] = response.data.reports;
      } catch (error) {
        console.error(`Error fetching reports for user ${usertoken}:`, error);
      }

      setUserReports(reports);
    };

    fetchReports();
  }, []);

  return (
    <div>
      <Header />
      <br />

      {userReports[usertoken] && (
        <div>
          {userReports[usertoken].map((report) => (
            <div key={report._id} style={{ marginBottom: "10px" }}>
              <br />
              <h4 style={{ textAlign: "center" }}>
                Company Name: {report.companyName}
              </h4>

              <h6 style={{ textAlign: "center" }}>
                Reporting Year: {report.reportingYear}
              </h6>
              <br />
              <div style={{ textAlign: "center" }}>
                <button onClick={() => generatePdf(report)}>
                  Download Report
                </button>
              </div>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
