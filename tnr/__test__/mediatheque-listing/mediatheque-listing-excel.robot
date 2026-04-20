*** Comments ***
# The following file used to test mediatheques listing with data from an excel file stores in: apps/starter/tnr/data/mediatheque-filters-data.xlsx
#    In case you wannna add other test cases, Don't forget to change the range in FOR LOOP in "Get Data From Excel And Run Tests" Keyword, this line to be specific: FOR    ${i}    IN RANGE    1    13


*** Settings ***
Documentation       Automation Testing for Vactory Next;
...                 To test Listing's Filetrs and Pagination

Library             SeleniumLibrary
Library             ExcelLibrary
Library             Collections
Resource            ../../config/env.robot
Resource            ../../config/config.robot

Test Setup          Open Browser    ${HOMEPAGE_URL}    ${BROWSER}
Test Teardown       Close Browser


*** Variables ***
&{Data}     key=value


*** Test Cases ***
Médiathèques Test Case
    # RUN_BROWSER_IN_HEADLESS_MODE
    Maximize Browser Window
    # Skip Video Ask Intro And Cookie Layer
    Go To Mediatheques Page
    Get Data From Excel And Run Tests


*** Keywords ***
#Skip Video Ask Intro And Cookie Layer
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

    ## If Cookie layer appeared, Close it
    #${is_cookie_layer_visible}=    Run Keyword And Return Status
    #...    Wait Until Element Is Visible
    #...    id:close-cookie-layer-btn
    #...    10
    #IF    ${is_cookie_layer_visible}
    #    Click Button    id:close-cookie-layer-btn
    #END

Go To Mediatheques Page
    Click Element    id:menu-link-modules
    Wait Until Element Is Visible    id:menu-link-mediatheques
    Click Element    id:menu-link-mediatheques
    Wait Until Element Is Visible    css=[data-df-id='vactory_mediatheque:list']

    # Hide header to preventing elements not being targeted
    Execute JavaScript    document.querySelector('header').style.display = 'none'

Get Data From Excel And Run Tests
    # open the excel file, loop through the rows and columns to get the data and store it in the dictionary &{Data}
    ExcelLibrary.Close All Excel Documents
    ExcelLibrary.Open Excel Document    ${MEDIATHEQUE_EXCEL_FILE}    template

    # loop through rows, skip the first row (which contains heading)
    FOR    ${i}    IN RANGE    1    14
        # loop through columns
        FOR    ${j}    IN RANGE    1    5
            # set the values for the dictionary
            ${Value}=    Read Excel Cell    row_num=${i}    col_num=${j}
            # if the value is empty or None, set it to EMPTY
            IF    '${Value}'=='None'
                ${Value}=    Set Variable    EMPTY
            END
            IF    '${Value}'=='EMPTY'
                ${Value}=    Set Variable    EMPTY
            END
            ${Key}=    Read Excel Cell    row_num=1    col_num=${j}
            Set To Dictionary    ${Data}    ${Key}    ${Value}
        END

        # Run the tests for each row based on the data we got from excel file and escape the 1st one because it contains unused data
        IF    ${i} > 1
            BuiltIn.Run Keyword And Continue On Failure    Inject Values to Filters
            BuiltIn.Run Keyword And Continue On Failure    Check Cards Results And Pagination
            # BuiltIn.Run Keyword And Continue On Failure    Check Pagination
            BuiltIn.Run Keyword And Continue On Failure    Reset Filters
        END
    END

Inject Values to Filters
    # get the values from the dictionary
    ${test_case}=    Get From Dictionary    ${Data}    Test case
    ${year}=    Get From Dictionary    ${Data}    year
    ${type}=    Get From Dictionary    ${Data}    type
    ${theme}=    Get From Dictionary    ${Data}    theme

    Log    ${test_case} : ${year} : ${type} : ${theme}

    IF    '${year}' != 'EMPTY'
        Scroll Element Into View    id:mediatheque-years
        Select From List by Label    id=mediatheque-years    ${year}
    END

    IF    '${type}' != 'EMPTY'
        Scroll Element Into View    id:mediatheque-types
        Select From List by Label    id=mediatheque-types    ${type}
    END

    IF    '${theme}' != 'EMPTY'
        Scroll Element Into View    id:mediatheque-theme
        Select From List by Label    id=mediatheque-theme    ${theme}
    END

    Click Button    id:mediatheque-submit
    Wait Until Element Is Not Visible    css=[data-testid='overlay']

Check Cards Results
    [Arguments]    ${test_case}    ${year}    ${type}    ${theme}

    # Get a list of all mediatheque cards
    ${mediatheque_cards}=    Get WebElements    xpath=//div[starts-with(@id, 'mediatheque-card-')]

    # Check if ${mediatheque_cards} has elements
    ${card_count}=    Get Length    ${mediatheque_cards}

    IF    ${card_count} > 0
        # Iterate over each card element
        FOR    ${card}    IN    @{mediatheque_cards}
            # If ${year} isn't empty, Then check if card has the selected year from the filter
            IF    '${year}' != 'EMPTY'
                ${card_date}=    Get Text    css=[id^=mediatheque-card-] .mediatheque-card-date
                ${year_string}=    Convert To String    ${year}
                Should Contain    ${card_date}    ${year_string}
            END

            # If ${type} isn't empty, Then check if card has the selected type from the filter
            IF    '${type}' != 'EMPTY'
                ${card_type}=    Get Element Attribute    ${card}    data-type
                Should Be Equal As Strings    ${card_type}    ${type}
            END

            # If ${theme} isn't empty, Then check if card has the selected theme from the filter
            IF    '${theme}' != 'EMPTY'
                ${card_badge}=    Get Text    css=[id^=mediatheque-card-] .badge
                Should Be Equal As Strings    ${card_badge}    ${theme}
            END
        END
    ELSE
        Log    No results match your filtering criteria
    END

Check Cards Results And Pagination
    # get the values from the dictionary
    ${test_case}=    Get From Dictionary    ${Data}    Test case
    ${year}=    Get From Dictionary    ${Data}    year
    ${type}=    Get From Dictionary    ${Data}    type
    ${theme}=    Get From Dictionary    ${Data}    theme

    # Check Cards Results
    BuiltIn.Run Keyword And Continue On Failure
    ...    Check Cards Results
    ...    ${test_case}
    ...    ${year}
    ...    ${type}
    ...    ${theme}

    # Check Pagination
    ${pagination_items}=    Get WebElements    xpath=//button[starts-with(@id, 'mediatheques-pagination-')]

    ${pages_count}=    Get Length    ${pagination_items}

    IF    ${pages_count} > 0
        FOR    ${index}    ${page}    IN ENUMERATE    @{pagination_items}
            Scroll Element Into View    ${page}
            Click Element    ${page}
            Log    You are currently in Page ${index + 1}    # Adding 1 to start index from 1

            # Check Cards Results for each page
            BuiltIn.Run Keyword And Continue On Failure
            ...    Check Cards Results
            ...    ${test_case}
            ...    ${year}
            ...    ${type}
            ...    ${theme}
        END
    END

Reset Filters
    Scroll Element Into View    id:mediatheque-reset
    Click Button    id:mediatheque-reset
    Wait Until Element Is Not Visible    css=[data-testid='overlay']

    ${year}=    Execute JavaScript    return document.getElementById('mediatheque-years').value
    Should Be Equal As Strings    ${year}    all

    ${type}=    Execute JavaScript    return document.getElementById('mediatheque-types').value
    Should Be Equal As Strings    ${type}    all

    ${theme}=    Execute JavaScript    return document.getElementById('mediatheque-theme').value
    Should Be Equal As Strings    ${theme}    all
