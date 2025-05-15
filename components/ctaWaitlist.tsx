"use client";
import Image from "next/image";
import Stripes from "@/public/images/stripes-dark.svg";

export default function CtaWithWaitlist() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-white text-gray-900 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-6xl py-20">
        <div
          className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-white"
          data-aos="zoom-y-out"
        >
          {/* Glow */}
          <div
            className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 translate-y-1/2"
            aria-hidden="true"
          >
            <div className="h-56 w-[480px] rounded-full border-[20px] border-blue-300 blur-3xl opacity-30" />
          </div>

          {/* Stripes */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform opacity-5"
            aria-hidden="true"
          >
            <Image
              className="max-w-none"
              src={Stripes}
              width={768}
              height={432}
              alt="Stripes"
            />
          </div>

          {/* Content */}
          <div className="px-6 py-12 md:px-12 md:py-20">
            <h2 className="mb-12 text-center py-4 text-3xl font-bold md:text-4xl">
              Become part of the mission to protect millions.
            </h2>

            <div className="flex flex-col gap-12 md:flex-row md:justify-center lg:justify-between">
              {/* Waitlist Column */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-2">
                  Join the Waitlist
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto md:mx-0">
                  Get early access to BluEyes and stay ahead of the storm.
                  You'll be notified as soon as we launch.
                </p>

                <form
                  action="https://formsubmit.co/BluEyeHurricaneAlerts@gmail.com"
                  method="POST"
                  className="flex flex-col justify-start lg:flex-row  md:justify-start items-center gap-4 max-w-2xl mx-auto md:mx-0"
                >
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className="w-full max-w-sm rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="submit"
                    className="btn bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md"
                  >
                    Get Early Access
                  </button>
                  <input type="hidden" name="_captcha" value="false" />
                  <input
                    type="hidden"
                    name="_next"
                    value="https://blueye-landing.vercel.app/thanks"
                  />
                </form>
              </div>

              {/* Divider on mobile */}
              <div className="block md:hidden lg:hidden border-t border-gray-200 my-2 w-full" />

              {/* Get In Touch Column */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-2">Get in Touch</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto md:mx-0">
                  Want to collaborate, invest, or help in another way? Let’s
                  talk! Reach out and join our mission.
                </p>

                <div className="flex justify-center lg:justify-start">
                  {/* Mobile: mailto link */}
                  <a
                    href="mailto:BluEyeHurricaneAlerts@gmail.com?subject=Hi%20there!&body=BluEye%20Team%20invites%20you%20to%20share%20your%20concerns%20about%20hurricane%20prevention.%0A%0ADo%20you%20want%20to%20collaborate,%20help,%20or%20invest?%0AWrite%20to%20us!"
                    className="btn group w-full sm:w-auto bg-gradient-to-t from-blue-600 to-blue-500 text-white shadow-md hover:to-blue-400 px-6 py-2 rounded-md block md:hidden"
                  >
                    <span className="relative inline-flex items-center">
                      Get In Touch
                      <span className="ml-1 text-blue-200 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </a>

                  {/* Desktop: Gmail compose link */}
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=BluEyeHurricaneAlerts@gmail.com&su=Hi%20there!&body=BluEye%20Team%20invites%20you%20to%20share%20your%20concerns%20about%20hurricane%20prevention.%0A%0ADo%20you%20want%20to%20collaborate,%20help,%20or%20invest?%0AWrite%20to%20us!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn group w-full sm:w-auto bg-gradient-to-t from-blue-600 to-blue-500 text-white shadow-md hover:to-blue-400 px-6 py-2 rounded-md hidden md:block"
                  >
                    <span className="relative inline-flex items-center">
                      Get In Touch
                      <span className="ml-1 text-blue-200 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
