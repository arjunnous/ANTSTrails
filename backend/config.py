import os

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+mysqldb://root:Nous%4012345@localhost:3306/nousqa_platform")
SECRET_KEY = os.getenv("SECRET_KEY", "51ab3d33d2d3b702262ea02321909c0844955fca0b8381bcec632af956618ac1")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8  # 8 hours
SSO_ENABLED = os.getenv("SSO_ENABLED", "false").lower() == "true"