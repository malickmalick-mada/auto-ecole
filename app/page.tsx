"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const route = useRouter();
  return (
    <div className="w-full flex flex-col h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      <Header />
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="hero"
        className="w-full flex flex-col md:flex-row min-h-screen snap-start p-4 md:p-0 pt-20 md:pt-0"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/2 h-full md:h-screen flex flex-col items-center md:items-start justify-center space-y-4 sm:space-y-6 md:space-y-10 text-center md:text-left"
        >
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl">
            Lorem, ipsum.
          </h1>
          <p className="text-base sm:text-lg md:text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet,
            facilis!
          </p>
          <div className="flex flex-row gap-2 sm:gap-4">
            <Button
              variant="destructive"
              className="rounded-full text-sm sm:text-base"
            >
              <a href="#about">Get started</a>
            </Button>
            <Button
              onClick={() => route.push("/signin")}
              variant="outline"
              className="rounded-full text-sm sm:text-base"
            >
              Sign In
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0"
        >
          <Image
            src="/image/hero.jpg"
            width={300}
            height={100}
            alt="hero"
            className="rounded-xl shadow-lg w-[250px] md:w-[300px]"
          />
        </motion.div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="about"
        className="w-full min-h-screen snap-start p-4 md:p-8 flex flex-col md:flex-row items-center justify-center gap-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <Image
            src="/image/about.jpg"
            width={400}
            height={300}
            alt="about"
            className="rounded-xl shadow-lg w-[250px] sm:w-[300px] md:w-[400px]"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            About Us
          </h2>
          <p className="text-base sm:text-lg md:text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            molestiae delectus culpa hic assumenda, voluptate reprehenderit
            dolore autem cum ullam sed odit perspiciatis.
          </p>
          <Button
            variant="destructive"
            className="rounded-full text-sm sm:text-base"
            onClick={() => route.push("/pages/about")}
          >
            Learn More
          </Button>
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="forum"
        className="w-full min-h-screen flex items-center justify-center snap-start p-4 md:p-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8"
          >
            Forum Community
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Card content */}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* After forum section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="contact"
        className="w-full min-h-screen flex items-center justify-center snap-start p-4 md:p-8 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8"
          >
            Contact Us
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-xl sm:text-2xl font-semibold">
                Get in Touch
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-semibold">Email:</span>{" "}
                  contact@example.com
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-semibold">Phone:</span> +1 234 567 890
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-semibold">Address:</span> 123 Street
                  Name, City, Country
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-2 border rounded-md text-sm sm:text-base"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-2 border rounded-md text-sm sm:text-base"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full p-2 border rounded-md text-sm sm:text-base"
                ></textarea>
                <Button
                  variant="destructive"
                  className="w-full rounded-full text-sm sm:text-base"
                >
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
