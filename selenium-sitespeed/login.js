module.exports = {
  run(context) {
    const { Builder, By, Capabilities, Key, logging, until } = context.webdriver;

    return context.runWithDriver(async driver => {
      // open page
      await driver.get("https://<TENANT>.sharepoint.com");

      // enter user name
      await driver.findElement(By.name("loginfmt")).sendKeys("<USERNAME>");
      await driver.findElement(By.id("idSIButton9")).click();

      // wait for password field
      await driver.wait(until.elementLocated(By.name("passwd")), 5000);

      await new Promise(async resolve => {
        const interval = setInterval(async () => {
          const element = await driver.findElement(By.name("passwd"));
          if ((await element.getAttribute("class")) === "form-control") {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      // enter password
      await driver.findElement(By.name("passwd")).sendKeys("<PASSWORD>");
      await driver.findElement(By.id("idSIButton9")).click();

      // confirm login
      await driver.wait(
        until.elementTextIs(
          driver.wait(until.elementLocated(By.id("KmsiDescription"))),
          "Do this to reduce the number of times you are asked to sign in."
        )
      );
      await driver.findElement(By.id("idSIButton9")).click();

      await driver.wait(until.elementLocated(By.id("SuiteNavPlaceHolder")));
    });
  }
};
