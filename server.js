const redis = require("redis");
const { setTimeout } = require("timers/promises");

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

redisClient.on("error", (error) => {
  console.error("Redis client error occured");
});

async function connectRedisFunc() {
  try {
    // setting connection to redis
    const res = await redisClient.connect();
    console.log("redis server connected", res);
    // storing key value pairs to redis
    await redisClient.set("name", "lucky");
    // retreiving store data
    const data = await redisClient.get("name");
    console.log(data);

    // delete data
    const deletedData = await redisClient.del("name");

    await redisClient.set("count", 100);

    // increase count
    await redisClient.incr("count");
    // decrease count

    await redisClient.decr("count");

    // decrease data by

    // data structures ///
    //  storing multiple data using string
    await redisClient.mSet([
      "user:name",
      "Lucky",
      "user:age",
      "12",
      "user:country",
      "Nigeria",
    ]);

    const [name, age, country] = await redisClient.mGet([
      "user:name",
      "user:age",
      "user:country",
    ]);
    console.log(name, age, country);
    await redisClient.decrBy("count", 5);
    const count = await redisClient.get("count");
    console.log("count result", count);

    // list data
    /* await redisClient.rPush("note", ["book1", "book2", "book3"])
     */
    await redisClient.lPop("note");
    await redisClient.rPush("note", ["new1", "new2"]);
    await redisClient.rPop("note");
    const result4 = await redisClient.lRange("note", 0, -1);
    console.log("result4", result4);
    // sets data type

    // used to add data to a set
    await redisClient.sAdd("newSet", ["john", "friday"]);

    // used to get members of a set
    const setList = await redisClient.sMembers("newSet");
    console.log(setList);

    // check if a string is a member of a set

    const isMember = await redisClient.sIsMember("newSet", "friday");
      console.log(isMember);
      
      // emiting, subscribing and listening to an event in redis
      
      const subscriber = redisClient.duplicate() // create a duplicate of the redisClient


      // connect subscriber to the redis server
      await subscriber.connect()
      await subscriber.subscribe("myChannel", (message,channel) => { 
          console.log(`Message send to lucky from ${channel}:`, message) 
      })
      redisClient.publish("myChannel", "Testing channels")
      redisClient.publish("myChannel", "Testing channel 2")
      await new Promise((resolve) => { 
          setTimeout(resolve, 1000)
      })

      await subscriber.unsubscribe("myChannel")
      await subscriber.quit()

  } catch (error) {
    console.log("Redis connection error:", error);
  } finally {
    await redisClient.quit();
  }
}

connectRedisFunc();
