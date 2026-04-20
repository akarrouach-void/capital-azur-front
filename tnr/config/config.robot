*** Settings ***    \
Library     SeleniumLibrary
Library     OperatingSystem
Resource    ./env.robot


*** Keywords ***
RUN_BROWSER_IN_HEADLESS_MODE
    ${chrome_options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    IF    ${MODE}!="window"
        Call Method    ${chrome_options}    add_argument    --headless
    END

    Call Method    ${chrome_options}    add_argument    --enable-logging
    Call Method    ${chrome_options}    add_argument    --ignore-certificate-errors
    Call Method    ${chrome_options}    add_argument    --disable-setuid-sandbox
    Call Method    ${chrome_options}    add_argument    --disable-extensions
    Call Method    ${chrome_options}    add_argument    --start-maximized
    Call Method    ${chrome_options}    add_argument    --disable-gpu
    Call Method    ${chrome_options}    add_argument    --no-sandbox
    Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
    Call Method    ${chrome_options}    add_argument    --disable-infobars

    IF    ${ENV}=="dev"
        Create Webdriver    Chrome    options=${chrome_options}
    END

    IF    ${ENV}=="prod"
        Create Webdriver    Chrome    options=${chrome_options}    executable_path=/usr/bin/chromedriver
    END

    Go To    ${HOMEPAGE_URL}
    # Open Browser    ${HOMEPAGE_URL}    ${BROWSER}    options=${chrome_options}
    Set Window Size    2560    1440

RUN_BROWSER_IN_NORMAL_MODE
    # ${chrome_options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver

    # Call Method    ${chrome_options}    add_argument    --ignore-certificate-errors

    Open Browser    ${HOMEPAGE_URL}    ${BROWSER}
    Maximize Browser Window
