const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { main, getTemplate } = require("../services/nodemailer");
const { v4: uuidv4 } = require("uuid");
const generatePasswordRand = require("../services/passGenerator");
const stripe = require("stripe")(process.env.STRIPE_KEY);
class userController {

  //1 - Crear usuario
  //localhost:4000/users/createUser

  createUser = (req, res) => {
    // captamos los parámetros del formulario
    const { name, nickname, last_name, email, password } = req.body.register;
    const { language } = req.body;

    // creamos una constante aleatoria que nos valdrá para la hora de verificar cuenta
    const code = uuidv4();

    // codificamos la contraseña
    let saltRounds = 8;
    bcrypt.genSalt(saltRounds, function (err, saltRounds) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        let sql = `INSERT INTO user (nickname, name, last_name, email, password, code) VALUES ("${nickname}", "${name}", "${last_name}", "${email}", "${hash}", "${code}")`;

        connection.query(sql, (error, result) => {
          try {
            if (error) {
              if (error.code == "ER_DUP_ENTRY") {
                res.status(500).json("Nickname o email ya existen");
              }
            } else {
              // enviamos token de verificacion
              let token = jwt.sign(
                {
                  data: {
                    email: email,
                    code: code,
                  },
                },
                process.env.SECRET,
                { expiresIn: "1h" }
              );

              // creamos la plantilla del email
              let template = getTemplate(name, token, language);

              // let template = "hola";
              let mensajeEmail = "" ;

              //evaluamos el idioma para crear la plantilla
                if (language == "en-GB" || language == "en-US"){

                  mensajeEmail="User verification email"
                }
                else if(language == "es-ES" || language == "es-419"){

                  mensajeEmail = "Mensaje de verificación de usuario"
                } 

              main(email, mensajeEmail, template).catch(console.error);

              res.status(200).json({ result });
            }
          } catch (error) {}
        });
      });
    });
  };

  //2 - login
  //localhost:4000/users/login

  login = (req, res) => {
    let { email, password } = req.body;
    let sql = `SELECT * FROM user WHERE email = '${email}'`;

    connection.query(sql, (error, result) => {
      try {
        //en caso de error en la consulta
        if (error) return res.status(400).json(error);

        //en caso de no encontrar un user con dicho user_name o mail.

        if (!result || !result.length || result[0].is_deleted == 1) {
          res.status(401).json("Usuario no registrado");
        } else if (result[0].is_verificated == 0) {
          let user = result[0];
          res.status(400).json({ user });
        } else {
          //en caso de que el mail o user_name SEA correcto
          //aqui lo estamos haciendo con el mail
          const [user] = result;
          const hash = user.password;

          //capturo el user_id
          const user_id = user.user_id;

          //compramos contraseñas
          bcrypt.compare(password, hash, (error, response) => {
            if (error) throw error;
            //si las contraseñas coinciden

            //creamos el token para enviarlo al front
            if (response === true) {
              const token = jwt.sign(
                {
                  user: {
                    email: user.email,
                    nickname: user.nickname,
                    name: user.name,
                    id: user_id,
                    type: user.type,
                    img: user.img,
                  },
                },
                process.env.SECRET,
                { expiresIn: "10d" }
              );
              res.status(200).json({ token });
              //si las contraseñas coinciden
            } else {
              res.status(401).json(error);
            }
          });
        }
      } catch (error) {}
    });
  };

  //3 - Traer la info de un usuario
  //localhost:4000/users/oneUser/:user_id

  selectOneUser = (req, res) => {
    const user_id = req.params.user_id;

    let sqlUser = `SELECT * FROM user WHERE user_id = ${user_id} and is_deleted = 0`;
    let sqlProjects = `SELECT project.*, size.* FROM project, size WHERE project.size_id = size.size_id and project.user_id = ${user_id} and project.is_deleted = 0`;
    let sqlSubscription = `SELECT subscription.* FROM subscription, user WHERE subscription.subscription_id = user.subscription_id and user.user_id = ${user_id}`;
    let sqlCategories = `SELECT * FROM category`;
    let sqlThemes = `SELECT * FROM theme`;
    let sqlSizes = `SELECT * FROM size`;

    connection.query(sqlUser, (error, resultUser) => {
      if (error) {
        res.status(400).json({ error });
      }
      let dateEnd = "";
      if (resultUser[0].subscription_end !== 0) {
        dateEnd = new Date(resultUser[0].subscription_end).toLocaleDateString(
          "es-ES"
        );
      }

      connection.query(sqlProjects, (error2, resultProject) => {
        if (error2) {
          res.status(400).json({ error2 });
        }
        connection.query(sqlSubscription, (error3, resultSubscription) => {
          if (error3) {
            res.status(400).json({ error3 });
          }
          connection.query(sqlCategories, (error4, resultCategories) => {
            if (error4) {
              res.status(400).json({ error4 });
            }
            connection.query(sqlThemes, (error5, resultThemes) => {
              if (error4) {
                res.status(400).json({ error5 });
              }
              connection.query(sqlSizes, (error5, resultSizes) => {
                if (error4) {
                  res.status(400).json({ error5 });
                }
                res
                  .status(200)
                  .json({
                    resultUser,
                    resultProject,
                    resultSubscription,
                    dateEnd,
                    resultCategories,
                    resultThemes,
                    resultSizes,
                  });
              });
            });
          });
        });
      });
    });
  };

  //4 - editar info usuario
  //localhost:4000/users/editUser/:userId

  editUser = (req, res) => {
    let user_id = req.params.user_id;

    const { nickname, name, last_name, email } = req.body;

    try {
      let sql = `UPDATE user SET nickname= "${nickname}", name = "${name}", last_name = "${last_name}", email = "${email}" WHERE user_id = "${user_id}"`;

      connection.query(sql, (error, result) => {
        if (error) {
          res.status(400).json("email ya existe en la BD");
        }
        res.status(200).json(result);
      });
    } catch (error) {
      res.status(400).json("Consulta mal realizada");
    }
  };

  //5 - editar foto usuario
  //localhost:4000/users/editImgUser/:userId

  editImgUser = (req, res) => {
    let user_id = req.params.user_id;
    let img = req.file.filename;

    let sql = `UPDATE user SET img = "${img}" WHERE user_id = ${user_id}`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  //6 - verificar contraseña
  //localhost:4000/users/checkPassword/:userId

  checkPassword = (req, res) => {
    const user_id = req.params.user_id;

    const { password } = req.body;

    let sql = `SELECT * FROM user WHERE user_id = ${user_id}`;

    connection.query(sql, (error, result) => {
      try {
        const [user] = result;
        const hash = user.password;

        bcrypt.compare(password, hash, (error, response) => {
          if (response == true) {
            res.status(200).json({ response });
          } else {
            res.status(401).json(response);
          }
        });
      } catch (error) {}
    });
  };

  //7 - editar contraseña
  //localhost:4000/users/editPassword/:userId

  editPassword = (req, res) => {
    const user_id = req.params.user_id;

    const { password } = req.body;

    let saltRounds = 8;
    bcrypt.genSalt(saltRounds, function (err, saltRounds) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        let sql = `UPDATE user SET password = "${hash}" WHERE user_id = ${user_id}`;

        connection.query(sql, (error, result) => {
          if (error) throw error;
          error
            ? res.status(400).json({ error })
            : res.status(200).json(result);
        });
      });
    });
  };

  //8 - borrado lógico de un usuario
  //localhost:4000/users/deleteUser/:userId

  deleteUser = (req, res) => {
    let user_id = req.params.user_id;

    let sql = `UPDATE user SET is_deleted = 1 WHERE user_id = "${user_id}"`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  //9 - verificar email
  //localhost:4000/users/verify/:token

  verifyUser = (req, res) => {
    try {
      // obtengo el token
      const { token } = req.params;

      let data = null;

      jwt.verify(token, process.env.SECRET, (error, result) => {
        if (error) {
          res.status(401).json("Error al obtener data del token");
        } else {
          data = result;
        }
      });

      // verificar data

      if (data == null) {
        res.status(401).json("Error al obtener data");
      }

      const { email, code } = data.data;

      // verificar que el usuario existe

      let sql = `SELECT * FROM user WHERE email = "${email}"`;
      connection.query(sql, (error, user) => {
        if (user == null) {
          res.status(401).json("Usuario no registrado");
        }

        if (code != user[0].code) {
          res.status(401).json("Dirección errónea");
        }

        let sql2 = `UPDATE user SET is_verificated = true WHERE email = "${email}"`;

        connection.query(sql2, (error, result) => {
          if (error) throw error;

          // res.status(200).json(result);
          // res.render(`emailConfirmed`);
          res.send(`<body style='margin: 0'><div style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw; background-color: #002646">
          <div style= "display: flex; flex-direction: column; align-items: center;">
            <p style= "padding: 2rem; color: #19BA7A; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 18pt;border-radius: 0.5rem; background-color: white;">&#x2611; You have successfully verified your account</p>           
            <a
              href="http://localhost:3000"
              target="_blank"
            ><button type= "submit" style="margin-top: 10px; padding: 25px; border-radius: 10px; background-color: #19BA7A; color: white; font-size: 20px; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">Back to Beemeral</button></a>
          </div>
          </div></body>`);
        });
      });
    } catch (error) {}
  };

  //10 - reenviar email de verificacion
  //localhost:4000/users/resendEmail

  resendEmail = (req, res) => {
    const { name, email, code } = req.body.data;
    const { language } = req.body;

    let token = jwt.sign(
      {
        data: {
          email: email,
          code: code,
        },
      },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    let template = getTemplate(name, token, language);

    let mensajeEmail = "" ;

      if (language == "en-GB" || language == "en-US"){

        mensajeEmail="User verification email"
      }
      else if(language == "es-ES" || language == "es-419"){

        mensajeEmail = "Mensaje de verificación de usuario"
      } 
      
    main(email, mensajeEmail, template).catch(console.error);

    res.status(200).json({ message: "Email resend" });
  };

  //11 - recuperación de contraseña
  //localhost:4000/users/forgotPassword

  forgotPassword = (req, res) => {
    const { email } = req.body.login;
    const { language } = req.body;

    try {
      let sql = `SELECT * FROM user WHERE email = "${email}"`;

      connection.query(sql, (error, user) => {
        if (user == null) {
          res.status(401).json("Email no registrado");
        }

        let password = generatePasswordRand(10, "rand");
        let saltRounds = 8;
        bcrypt.genSalt(saltRounds, function (err, saltRounds) {
          bcrypt.hash(password, saltRounds, function (err, hash) {
            let sql = `UPDATE user SET password = "${hash}" WHERE email = "${email}"`;

            connection.query(sql, (error, result) => {
              if (error) {
                res.status(400).json({ error });
              } else {
                let subject = "";
                let messageEmail = "";

                if (language == "en-GB" || language == "en-US") {
                  subject = "Beemeral password recovery email";
                  messageEmail = ` <div id="email___content">

            <div style="background-color: #002646; padding: 10px;width: 70%">
              <img style="object-fit: contain; object-position: center;" src="https://beemeral.com/wp-content/uploads/2022/12/Beemeral_Logo_N.png" alt="">
            </div>            
            <h3>These are your login details:</h3>
            <p>email: ${email}</p>            
            <p>password: ${password}</p>
            <a
            href="http://localhost:3000"
            target="_blank"
          ><button style="margin-top: 10px; padding: 10px; border-radius: 10px; background-color: #19BA7A; color: white">Back to Beemeral</button></a>
          </div>`;
                } else if (language == "es-ES" || language == "es-419") {
                  subject = "Beemeral email de recuperación de contraseña";
                  messageEmail = ` <div id="email___content">
              <div style="background-color: #002646; padding: 10px;width: 70%">
                <img style="object-fit: contain; object-position: center;" src="https://beemeral.com/wp-content/uploads/2022/12/Beemeral_Logo_N.png" alt="">
              </div>            
              <h3>Tus credenciales son:</h3>
              <p>email: ${email}</p>            
              <p>contraseña: ${password}</p>
              <a
              href="http://localhost:3000"
              target="_blank"
            ><button style="margin-top: 10px; padding: 10px; border-radius: 10px; background-color: #19BA7A; color: white">Volver a Beemeral</button></a>
            </div>`;
                }

                main(email, subject, messageEmail).catch(console.error);
              }
            });
          });
        });
      });
    } catch (error) {}
  };

  //12 - gastar un render
  // localhost:4000/users/spendRender/:user_id

  spendRender = (req, res) => {
    const { user_id } = req.params;

    let sql = `UPDATE user SET cont_render = cont_render + 1 WHERE user_id = ${user_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  //13 - gastar un export
  // localhost:4000/users/spendExport/:user_id

  spendExport = (req, res) => {
    const { user_id } = req.params;

    let sql = `UPDATE user SET cont_export = cont_export + 1 WHERE user_id = ${user_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  //14 - traer todos los precios disponibles en la cuenta de Stripe
  //localhost:4000/users/getPrices
  getPrices = async (req, res) => {
    const prices = await stripe.prices.list();
    res.json(prices.data.reverse());
  };
}

module.exports = new userController();
