第三方项目目录（未作适应性修改）


开始使用 PHPUnit
一、下载
➜ wget https://phar.phpunit.de/phpunit.phar
➜ chmod +x phpunit.phar
➜ sudo mv phpunit.phar /usr/local/bin/phpunit
➜ phpunit --version
  PHPUnit 5.4.0 by Sebastian Bergmann and contributors.
  
二、测试代码
src/Money.php
    <?php
    class Money
    {
        private $amount;
    
        public function __construct($amount)
        {
            $this->amount = $amount;
        }
    
        public function getAmount()
        {
            return $this->amount;
        }
    
        public function negate()
        {
            return new Money(-1 * $this->amount);
        }
    
        // ...
    }
    ?>
tests/MoneyTest.php
    <?php
    class MoneyTest extends PHPUnit_Framework_TestCase
    {
        // ...
    
        public function testCanBeNegated()
        {
            // Arrange
            $a = new Money(1);
    
            // Act
            $b = $a->negate();
    
            // Assert
            $this->assertEquals(-1, $b->getAmount());
        }
    
        // ...
    }
    ?>
➜ phpunit --bootstrap src/autoload.php tests/MoneyTest
PHPUnit 4.4.0 by Sebastian Bergmann.
....................
Time: 121 ms, Memory: 4.50Mb
OK (20 tests, 39 assertions)
我们看看上面三个部分的调用意味着什么:

phpunit PHPUnit使用命令行运行测试用例。 我们假设您已经下载了 phpunit.phar (见上面) 并把 PHPUnit 放到你的 $PATH中.
--bootstrap src/autoload.php 在命令行执行测试之前需指定 PHPUnit 引入 src/autoload.php （可以在这里找到） 文件。 这样的引导脚本通常用于设置半自动的测试类。
tests/MoneyTest instructs the PHPUnit command-line test runner to execute the tests of the MoneyTest class that is declared in tests/MoneyTest.php.
Using tests instead of tests/MoneyTest would instruct the PHPUnit command-line test runner to execute all tests found declared in *Test.php sourcecode files in the tests directory.
文档地址：http://www.phpunit.cn/manual/current/zh_cn/index.html


