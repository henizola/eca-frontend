const EcaDirectives = require("../models/directives-model");

const API = require("../api.js");

const rednderDirectivesAm = async (req, res) => {
  const directives = await EcaDirectives.find({ name: /haric/i });

  const law = [
    {
      name: "Communications Service Proclamation No. 1148-2019.pdf",
      fileName: "CommunicationsяServiceяProclamationяNo.я1148-2019.pdf",
      size: "2.4mb",
    },
  ];

  policy = [
    {
      name: "FDRE -ICT POLICY ENGLISH Final Approved.pdf",
      fileName: "FDRE -ICT POLICY ENGLISH Final Approved.pdf",
      size: "1.4mb",
    },
  ];

  //   res.status(200).send(ad);
  res.render("resourceAm", {
    directives: directives,
    API: API,
    law: law,
    policy: policy,
  });
};

module.exports = rednderDirectivesAm;
