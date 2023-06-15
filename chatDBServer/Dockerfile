FROM python:3.9

USER root

RUN apt-get -y update && apt-get -y upgrade
RUN apt-get -y install locales && \
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9
ENV TERM xterm

RUN apt-get install -y --fix-missing ffmpeg
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

RUN pip install -U ipython ipykernel
RUN pip install -U tavern fastapi unicorn uvicorn requests openai speechrecognition python-multipart pydub ffmpeg-python tiktoken mysqlclient

WORKDIR /app