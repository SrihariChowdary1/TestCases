import { Builder, By, Key, until } from "selenium-webdriver";

const driver = await new Builder().forBrowser("chrome").build();
await driver.get("https://app.todoist.com/app");

// Helper function to clear input fields
async function clearField(inputElement) {
  const value = await inputElement.getAttribute("value");
  for (let i = 0; i < value.length; i++) {
    await inputElement.sendKeys(Key.BACK_SPACE);
  }
}

// Helper function to perform login and verify result
async function loginAndCheck(emailText, passwordText, expectedMessage, testCaseName) {
  await driver.navigate().refresh();
  const email = await driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Enter your email..."]')));
  await clearField(email);
  await email.sendKeys(emailText, Key.ENTER);

  const password = await driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Enter your password..."]')));
  await clearField(password);
  await password.sendKeys(passwordText, Key.ENTER);

  const loginBtn = await driver.wait(until.elementLocated(By.xpath('//button[@type="submit"]')));
  await loginBtn.click();
  await driver.sleep(2000);

  if (expectedMessage === "dashboard") {
    const title = await driver.getTitle();
    console.log(title.includes("Todoist") ? ` ${testCaseName} Passed` : ` ${testCaseName} Failed`);
  } else {
    try {
      const error = await driver.wait(until.elementLocated(By.xpath(`//div[text()='${expectedMessage}']`)), 5000);
      const msg = await error.getText();
      console.log(msg === expectedMessage ? ` ${testCaseName} Passed` : ` ${testCaseName} Failed`);
    } catch (err) {
      console.log(` ${testCaseName} Failed - Error not found`);
    }
  }
}

// Test Case 1 - Invalid Email and Invalid Password
await loginAndCheck(
  "invalid@example.com",
  "WrongPass1!",
  "Wrong email or password.",
  "Test Case 1 - Invalid Email & Password"
);

// Test Case 2 - Valid Email and Invalid Password
await loginAndCheck(
  "srihari.bonthu001@gmail.com",
  "WrongPass1!",
  "Wrong email or password.",
  "Test Case 2 - Valid Email & Invalid Password"
);

// Test Case 3 - Valid Credentials
await loginAndCheck(
  "srihari.bonthu001@gmail.com",
  "Srihari1@",
  "dashboard",
  "Test Case 3 - Valid Login"
);

// Test Case 4 - Empty Email
await loginAndCheck(
  "",
  "Srihari1@",
  "Please enter a valid email address",
  "Test Case 4 - Empty Email"
);

// Test Case 5 - Empty Password
await loginAndCheck(
  "srihari.bonthu001@gmail.com",
  "",
  "Passwords must be at least 8 characters long.",
  "Test Case 5 - Empty Password"
);

// Test Case 6 - Invalid Email Format
await loginAndCheck(
  "invalid-email-format",
  "Srihari1@",
  "Please enter a valid email address",
  "Test Case 6 - Invalid Email Format"
);

// Test Case 7 - Special Characters in Password
await loginAndCheck(
  "srihari.bonthu001@gmail.com",
  "!@#$%^&*()",
  "Wrong email or password.",
  "Test Case 7 - Special Character Password"
);

await driver.quit();