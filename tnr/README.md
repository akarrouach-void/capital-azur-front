# Setting up Robot Framework

- Make sure you have python 3.9 installed.
- Install Robot Framework by running the following command:
  `pip install robotframework`
- Install the SeleniumLibrary for Robot Framework by running the following command:
  `pip install robotframework-seleniumlibrary`
- Install Excel Library for Robot Framework by running the following command:
  `pip install robotframework-excellibrary`
- Install the appropriate WebDriver for the browser you intend to use for testing. for example installing geckodriver in Mac.
  `brew install geckodriver --cask`
- Navigate to where the test file is located, Run a Robot Framework test file by running the following command:
  `python3 -m robot FILE-NAME.robot`
