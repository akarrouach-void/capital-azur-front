*** Settings ***
Library     SeleniumLibrary


*** Variables ***
# env    dev/prod
${ENV}                  "dev"
# mode    headless/window
${MODE}                 "headless"
${HOMEPAGE_URL}         http://localhost:3000/en
${MEDIATHEQUE_EXCEL_FILE}           ../../data/mediatheque-filters-data.xlsx
${BROWSER}              Chrome
