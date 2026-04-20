# The following file used to test mediatheques listing with static data which are stored in Variables section below.

*** Settings ***
Documentation       Automation Testing for Vactory Next;
...                 To test Listing's Filetrs and Pagination

Library             SeleniumLibrary
Resource            ../../config/env.robot
Resource            ../../config/config.robot

Test Setup          Open Browser    ${HOMEPAGE_URL}    ${BROWSER}
Test Teardown       Close Browser


*** Variables ***
${selected_year}        ${EMPTY}
${selected_type}        Video
${selected_theme}       Event


*** Test Cases ***
Médiathèques Test Case
#    RUN_BROWSER_IN_HEADLESS_MODE
    #Skip Video Ask Intro
    Go To Mediatheques Page
    Inject Values to Filters
    Check Cards Results
    Reset Filters


*** Keywords ***
#Skip Video Ask Intro
    ## If video ask appeared, click on Confirm button, Else skip it
    #${is_videoask_skipintro_visible}=    Run Keyword And Return Status
    #...    Wait Until Element Is Visible
    #...    id:video_ask_skip_intro
    #...    10
    #IF    ${is_videoask_skipintro_visible}
    #    Click Button    id:video_ask_skip_intro
    #END
    #Wait Until Element Is Visible    id:modal-close-video-ask
    #Click Button    id:modal-close-video-ask-confirm

Go To Mediatheques Page
    Click Element    id:menu-link-modules
    Wait Until Element Is Visible    id:menu-link-mediatheques
    Click Element    id:menu-link-mediatheques
    Wait Until Element Is Visible    css=[data-df-id='vactory_mediatheque:list']

Inject Values to Filters
    IF    '${selected_year}' != ''
        Select From List by Label    id=mediatheque-years    ${selected_year}
    END

    IF    '${selected_type}' != ''
        Select From List by Label    id=mediatheque-types    ${selected_type}
    END

    IF    '${selected_theme}' != ''
        Select From List by Label    id=mediatheque-theme    ${selected_theme}
    END

    Click Button    id:mediatheque-submit
    Wait Until Element Is Not Visible    css=[data-testid='overlay']

Check Cards Results
    # Get a list of all mediatheque cards
    ${mediatheque_cards}=    Get WebElements    xpath=//div[starts-with(@id, 'mediatheque-card-')]

    # Iterate over each card element
    FOR    ${card}    IN    @{mediatheque_cards}
        # If ${selected_year} isn't empty, Then check if card has the selected year from the filter
        ${card_date}=    Get Text    css=[id^=mediatheque-card-] .mediatheque-card-date
        IF    '${selected_year}' != ''
            Should Contain    ${card_date}    ${selected_year}
        END

        # If ${selected_type} isn't empty, Then check if card has the selected type from the filter
        ${card_type}=    Get Element Attribute    ${card}    data-type
        IF    '${selected_type}' != ''
            Should Be Equal As Strings    ${card_type}    ${selected_type}
        END

        # If ${selected_theme} isn't empty, Then check if card has the selected theme from the filter
        ${card_badge}=    Get Text    css=[id^=mediatheque-card-] .badge
        IF    '${selected_theme}' != ''
            Should Be Equal As Strings    ${card_badge}    ${selected_theme}
        END
    END

Reset Filters
    Click Button    id:mediatheque-reset
    Wait Until Element Is Not Visible    css=[data-testid='overlay']

    ${selected_year}=    Execute JavaScript    return document.getElementById('mediatheque-years').value
    Should Be Equal As Strings    ${selected_year}    all

    ${selected_type}=    Execute JavaScript    return document.getElementById('mediatheque-types').value
    Should Be Equal As Strings    ${selected_type}    all

    ${selected_theme}=    Execute JavaScript    return document.getElementById('mediatheque-theme').value
    Should Be Equal As Strings    ${selected_theme}    all
